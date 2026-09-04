'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Glasses, TriangleAlert, PackageX, DollarSign, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Pencil, Trash2, MoreVertical } from 'lucide-react'

type OpticalItem = {
  id: string
  itemName?: string | null
  brand?: string | null
  manufacturer?: string | null
  stockQuantity?: number | null
  reorderLevel?: number | null
  purchasePrice?: number | null
  sellingPrice?: number | null
}

type FrameMeta = {
  sku?: string
  model?: string
  color?: string
  eyeSize?: string
  bridge?: string
  temple?: string
  material?: string
}

function parseFrameMeta(raw: string | null | undefined): FrameMeta {
  const text = String(raw || '').trim()
  if (!text.startsWith('{') || !text.endsWith('}')) return {}
  try {
    const data = JSON.parse(text) as Record<string, unknown>
    return {
      sku: typeof data.sku === 'string' ? data.sku : undefined,
      model: typeof data.model === 'string' ? data.model : undefined,
      color: typeof data.color === 'string' ? data.color : undefined,
      eyeSize: typeof data.eyeSize === 'string' ? data.eyeSize : undefined,
      bridge: typeof data.bridge === 'string' ? data.bridge : undefined,
      temple: typeof data.temple === 'string' ? data.temple : undefined,
      material: typeof data.material === 'string' ? data.material : undefined,
    }
  } catch {
    return {}
  }
}

function toMoney(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function FrameInventoryPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [rows, setRows] = useState<OpticalItem[]>([])

  const [adjustItem, setAdjustItem] = useState<OpticalItem | null>(null)
  const [adjustQty, setAdjustQty] = useState('')

  useEffect(() => {
    if (searchParams.get('view') === 'lowstock') setStockFilter('low-stock')
  }, [searchParams])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/inventory/optical', {
        params: {
          itemType: 'Frame',
          search: search.trim() || undefined,
          page: 1,
          limit: 200,
        },
      })
      const payload = response.data as { data?: OpticalItem[] }
      setRows(Array.isArray(payload?.data) ? payload.data : [])
    } catch {
      toast.error('Failed to load frame inventory')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [search])

  const onDelete = useCallback(async (id: string) => {
    const ok = window.confirm('Delete this frame item? This action cannot be undone.')
    if (!ok) return

    try {
      await api.delete(`/inventory/optical/${id}`)
      toast.success('Frame deleted')
      await load()
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(typeof message === 'string' ? message : 'Failed to delete frame')
    }
  }, [load])

  useEffect(() => {
    const timer = setTimeout(() => {
      load()
    }, 250)
    return () => clearTimeout(timer)
  }, [load])

  const brands = useMemo(() => {
    const all = rows.map((item) => String(item.brand || '').trim()).filter(Boolean)
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const filtered = useMemo(() => {
    return rows.filter((item) => {
      const stock = Number(item.stockQuantity || 0)
      const reorder = Number(item.reorderLevel || 0)
      const brandOk = brandFilter === 'all' || String(item.brand || '') === brandFilter
      const stockOk =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && stock > 0) ||
        (stockFilter === 'low-stock' && stock > 0 && stock <= reorder) ||
        (stockFilter === 'out-of-stock' && stock <= 0)
      return brandOk && stockOk
    })
  }, [rows, brandFilter, stockFilter])

  const stats = useMemo(() => {
    let lowStock = 0
    let outOfStock = 0
    let totalValue = 0

    for (const item of filtered) {
      const stock = Number(item.stockQuantity || 0)
      const reorder = Number(item.reorderLevel || 0)
      const cost = Number(item.purchasePrice || 0)
      totalValue += stock * cost
      if (stock <= 0) outOfStock += 1
      if (stock > 0 && stock <= reorder) lowStock += 1
    }

    return {
      totalFrames: filtered.length,
      lowStock,
      outOfStock,
      totalValue,
    }
  }, [filtered])

  return (
    <div className="optical-page w-full min-w-0 p-4 sm:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Frame Inventory</h1>
          <p className="mt-1 text-xl text-slate-600">Manage optical frames</p>
        </div>
        <Button asChild className="h-11 rounded-xl bg-[#0EA5E9] px-6 text-base font-semibold hover:bg-[#0c96d4]">
          <Link href="/dashboard/optical-shop/frames/new">+ Add Frame</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search frames..."
            className="h-11 rounded-xl pl-12 text-base"
          />
        </div>

        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="h-11 w-full min-w-[200px] rounded-xl text-base">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="h-11 w-full min-w-[200px] rounded-xl text-base">
            <SelectValue placeholder="All Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm md:text-base text-slate-500">Total Frames</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">{stats.totalFrames}</div>
            <Glasses className="h-10 w-10 text-[#0EA5E9]" />
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm md:text-base text-slate-500">Inventory Value</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl md:text-3xl font-bold text-[#0EA5E9] tabular-nums">{toMoney(stats.totalValue)}</div>
            <DollarSign className="h-10 w-10 text-[#0EA5E9]" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">SKU</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Brand / Model</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Color</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Size</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Material</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Cost Price</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Retail</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6">Stock</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest py-4 px-6 text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-lg text-slate-500">
                    {loading ? 'Loading...' : 'No frames found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const meta = parseFrameMeta(item.manufacturer)
                  const stock = Number(item.stockQuantity || 0)
                  const size = [meta.eyeSize, meta.bridge, meta.temple].filter(Boolean).join('-') || '-'
                  return (
                    <TableRow key={item.id} className="cursor-pointer border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {meta.sku || '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{meta.model || item.itemName || '-'}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.brand || '-'}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400">{meta.color || '-'}</TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400">{size}</TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm text-slate-600 dark:text-slate-400">{meta.material || '-'}</TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm font-medium text-slate-600 dark:text-slate-400">{toMoney(Number(item.purchasePrice || 0))}</TableCell>
                      <TableCell className="px-6 py-4 align-middle text-sm font-bold text-slate-900 dark:text-slate-100">{toMoney(Number(item.sellingPrice || 0))}</TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                          stock > (item.reorderLevel || 10) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
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
                                <Link href={`/dashboard/optical-shop/frames/new?id=${item.id}`}>
                                  <Pencil className="h-4 w-4 text-[#0EA5E9]" />
                                  Edit Frame
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setAdjustItem(item); setAdjustQty(''); }} className="flex items-center gap-2 p-3 font-medium text-emerald-600 focus:text-emerald-600">
                                <Plus className="h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => void onDelete(item.id)} className="flex items-center gap-2 p-3 font-medium text-red-600 focus:text-red-600">
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
              Adjusting stock for: <span className="font-semibold text-slate-900 dark:text-white">{parseFrameMeta(adjustItem?.manufacturer).model || adjustItem?.itemName}</span>
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

