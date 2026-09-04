'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleDot, PackageX, Search, TriangleAlert, Plus, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

type OpticalItem = {
  id: string
  itemName?: string | null
  brand?: string | null
  manufacturer?: string | null
  stockQuantity?: number | null
  reorderLevel?: number | null
  sellingPrice?: number | null
}

type LensMeta = {
  sku?: string
  type?: string
  material?: string
  index?: string
  sphereMin?: string
  sphereMax?: string
  cylinderMin?: string
  cylinderMax?: string
  coatings?: string[]
}

function parseLensMeta(raw: string | null | undefined): LensMeta {
  const text = String(raw || '').trim()
  if (!text.startsWith('{') || !text.endsWith('}')) return {}
  try {
    const data = JSON.parse(text) as Record<string, unknown>
    return {
      sku: typeof data.sku === 'string' ? data.sku : undefined,
      type: typeof data.type === 'string' ? data.type : undefined,
      material: typeof data.material === 'string' ? data.material : undefined,
      index: typeof data.index === 'string' ? data.index : undefined,
      sphereMin: typeof data.sphereMin === 'string' ? data.sphereMin : undefined,
      sphereMax: typeof data.sphereMax === 'string' ? data.sphereMax : undefined,
      cylinderMin: typeof data.cylinderMin === 'string' ? data.cylinderMin : undefined,
      cylinderMax: typeof data.cylinderMax === 'string' ? data.cylinderMax : undefined,
      coatings: Array.isArray(data.coatings) ? data.coatings.filter((item): item is string => typeof item === 'string') : [],
    }
  } catch {
    return {}
  }
}

function money(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function normalizeOptionValue(value: string | undefined): string {
  return (value || '').trim().toLowerCase()
}

function toOptionLabel(value: string): string {
  const raw = value.trim()
  if (!raw) return raw
  if (raw.toUpperCase() === 'CR39') return 'CR39'
  return raw.replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function LensInventoryPage() {
  const [rows, setRows] = useState<OpticalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [materialFilter, setMaterialFilter] = useState('all')

  const [adjustItem, setAdjustItem] = useState<OpticalItem | null>(null)
  const [adjustQty, setAdjustQty] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/inventory/optical', {
        params: {
          itemType: 'Lens',
          page: 1,
          limit: 1000,
        },
      })

      const payload = response.data as { data?: OpticalItem[] }
      setRows(Array.isArray(payload?.data) ? payload.data : [])
    } catch {
      toast.error('Failed to load lens inventory')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  const onDelete = useCallback(async (id: string) => {
    const ok = window.confirm('Delete this lens item? This action cannot be undone.')
    if (!ok) return

    try {
      await api.delete(`/inventory/optical/${id}`)
      toast.success('Lens deleted')
      await load()
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(typeof message === 'string' ? message : 'Failed to delete lens')
    }
  }, [load])

  useEffect(() => {
    const timer = setTimeout(() => {
      load()
    }, 250)
    return () => clearTimeout(timer)
  }, [load])

  const typeOptions = useMemo(() => {
    const presetTypes = ['Single', 'Progressive', 'Bifocal', 'Multifocal']
    const values = rows
      .map((row) => parseLensMeta(row.manufacturer).type || '')
      .map((item) => item.trim())
      .filter(Boolean)
    const normalizedMap = new Map<string, string>()

    for (const item of [...presetTypes, ...values]) {
      const normalized = normalizeOptionValue(item)
      if (!normalized) continue
      if (!normalizedMap.has(normalized)) {
        normalizedMap.set(normalized, toOptionLabel(item))
      }
    }

    return Array.from(normalizedMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
  }, [rows])

  const materialOptions = useMemo(() => {
    const presetMaterials = ['CR39', 'Polycarbonate', 'Trivex', 'High Index', 'Glass']
    const values = rows
      .map((row) => parseLensMeta(row.manufacturer).material || '')
      .map((item) => item.trim())
      .filter(Boolean)
    const normalizedMap = new Map<string, string>()

    for (const item of [...presetMaterials, ...values]) {
      const normalized = normalizeOptionValue(item)
      if (!normalized) continue
      if (!normalizedMap.has(normalized)) {
        normalizedMap.set(normalized, toOptionLabel(item))
      }
    }

    return Array.from(normalizedMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
  }, [rows])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const meta = parseLensMeta(row.manufacturer)
      const normalizedType = normalizeOptionValue(meta.type)
      const normalizedMaterial = normalizeOptionValue(meta.material)
      const query = search.trim().toLowerCase()
      const typeOk = typeFilter === 'all' || normalizedType === typeFilter
      const materialOk = materialFilter === 'all' || normalizedMaterial === materialFilter

      if (!query) return typeOk && materialOk

      const sku = (meta.sku || '').toLowerCase()
      const name = (row.itemName || '').toLowerCase()
      const type = (meta.type || '').toLowerCase()
      const material = (meta.material || '').toLowerCase()
      const matchSearch = sku.includes(query) || name.includes(query) || type.includes(query) || material.includes(query)

      return typeOk && materialOk && matchSearch
    })
  }, [rows, typeFilter, materialFilter, search])

  const stats = useMemo(() => {
    const lowStock = filtered.filter((row) => Number(row.stockQuantity || 0) > 0 && Number(row.stockQuantity || 0) <= Number(row.reorderLevel || 0)).length
    const outOfStock = filtered.filter((row) => Number(row.stockQuantity || 0) <= 0).length
    return {
      total: filtered.length,
      lowStock,
      outOfStock,
    }
  }, [filtered])

  return (
    <div className="optical-page w-full min-w-0 p-4 sm:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Lens Inventory</h1>
          <p className="mt-1 text-xl text-slate-600">Manage optical lenses</p>
        </div>
        <Button asChild className="h-11 rounded-xl bg-[#0EA5E9] px-6 text-base font-semibold hover:bg-[#0c96d4]">
          <Link href="/dashboard/optical-shop/lenses/new">+ Add Lens</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search lenses..."
            className="h-11 rounded-xl pl-12 text-base"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-11 min-w-[180px] rounded-xl text-base">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={materialFilter} onValueChange={setMaterialFilter}>
          <SelectTrigger className="h-11 min-w-[200px] rounded-xl text-base">
            <SelectValue placeholder="All Materials" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Materials</SelectItem>
            {materialOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm md:text-base text-slate-500">Total Lens Types</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">{stats.total}</div>
            <CircleDot className="h-10 w-10 text-[#0EA5E9]" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm md:text-base text-slate-500">Low Stock</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl md:text-3xl font-bold text-amber-600 tabular-nums">{stats.lowStock}</div>
            <TriangleAlert className="h-10 w-10 text-amber-500" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm md:text-base text-slate-500">Out of Stock</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl md:text-3xl font-bold text-red-600 tabular-nums">{stats.outOfStock}</div>
            <PackageX className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">SKU</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Lens Type</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Material / Index</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Sphere / Cyl Range</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Coatings</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Price</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Stock</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6 text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-lg text-slate-500">
                    {loading ? 'Loading...' : 'No lenses found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const meta = parseLensMeta(row.manufacturer)
                  const stock = Number(row.stockQuantity || 0)
                  return (
                    <TableRow key={row.id} className="cursor-pointer border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {meta.sku || row.itemName || '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{meta.type || '-'}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400">
                        {meta.material || '-'} <span className="opacity-50">/</span> {meta.index || '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400">
                        Sph: {meta.sphereMin || '-'} to {meta.sphereMax || '-'}<br />
                        Cyl: {meta.cylinderMin || '-'} to {meta.cylinderMax || '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {(meta.coatings || []).length === 0 ? (
                            <span className="text-xs text-slate-400">-</span>
                          ) : (
                            (meta.coatings || []).map((coating) => (
                              <span key={coating} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {coating}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm font-bold text-slate-900 dark:text-slate-100">
                        {money(Number(row.sellingPrice || 0))}
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                          stock > (row.reorderLevel || 10) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            stock > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {stock} units
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle text-right">
                        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                              <DropdownMenuItem asChild className="flex items-center gap-2 p-3 font-medium">
                                <Link href={`/dashboard/optical-shop/lenses/new?id=${row.id}`}>
                                  <Pencil className="h-4 w-4 text-[#0EA5E9]" />
                                  Edit Lens
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setAdjustItem(row); setAdjustQty(''); }} className="flex items-center gap-2 p-3 font-medium text-emerald-600 focus:text-emerald-600">
                                <Plus className="h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => void onDelete(row.id)} className="flex items-center gap-2 p-3 font-medium text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!adjustItem} onOpenChange={(open) => !open && setAdjustItem(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock Quantity</DialogTitle>
            <DialogDescription>
              Adjusting stock for: <span className="font-semibold text-slate-900 dark:text-white">{parseLensMeta(adjustItem?.manufacturer).sku || adjustItem?.itemName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold">Adjustment Quantity (Units)</Label>
              <Input
                type="number"
                placeholder="e.g. 10 or -5"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="col-span-3 text-sm h-11"
              />
              <p className="text-xs text-slate-500">
                Current stock: {adjustItem?.stockQuantity} units<br />
                Positive value to add stock, negative to subtract.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustItem(null)}>Cancel</Button>
            <Button
              className="bg-[#0EA5E9] hover:bg-[#0c96d4] text-white"
              onClick={async () => {
                const delta = parseInt(adjustQty, 10);
                if (isNaN(delta) || delta === 0) {
                  toast.error('Please enter a valid non-zero adjustment quantity')
                  return
                }
                const newStock = Number(adjustItem?.stockQuantity || 0) + delta;
                if (newStock < 0) {
                  toast.error('Adjustment would result in negative stock.')
                  return
                }
                try {
                  await api.post(`/inventory/optical/${adjustItem?.id}/adjust`, { quantity: delta })
                  toast.success('Stock adjusted successfully')
                  setAdjustItem(null)
                  setAdjustQty('')
                  load()
                } catch {
                  toast.error('Failed to adjust stock')
                }
              }}
            >
              Adjust Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
