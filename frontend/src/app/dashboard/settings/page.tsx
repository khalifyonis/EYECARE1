'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePage from "../profile/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Settings2, User } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <header className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Settings</h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Manage your system preferences and account settings.</p>
            </header>

            <Tabs defaultValue="profile" className="w-full shadow-sm rounded-xl">
                <TabsList className="grid w-full max-w-[400px] grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 h-12 shadow-inner border border-slate-200/50 dark:border-slate-800">
                    <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#0EA5E9] data-[state=active]:shadow-sm transition-all text-xs font-bold leading-none h-10"><User className="w-4 h-4 mr-1.5" />PROFILE</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#0EA5E9] data-[state=active]:shadow-sm transition-all text-xs font-bold leading-none h-10"><Bell className="w-4 h-4 mr-1.5" />ALERTS</TabsTrigger>
                    <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#0EA5E9] data-[state=active]:shadow-sm transition-all text-xs font-bold leading-none h-10"><Settings2 className="w-4 h-4 mr-1.5" />SYSTEM</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 outline-none focus:outline-none 
                    data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-left-4 duration-500">
                    <div className="-mx-4 sm:-mx-6 lg:mx-0">
                        {/* We use the existing profile page to avoid duplicating UI */}
                        <ProfilePage />
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 outline-none focus:outline-none 
                    data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-left-4 duration-500">
                    <Card className="shadow-xl border-blue-100/50 dark:border-slate-800 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what updates you want to receive directly via email or dashboard alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-48 flex items-center justify-center border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-amber-500" />
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Coming Soon</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-4 outline-none focus:outline-none 
                    data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-left-4 duration-500">
                    <Card className="shadow-xl border-blue-100/50 dark:border-slate-800 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                            <CardTitle>System Configuration</CardTitle>
                            <CardDescription>Manage global application settings, integrations, and theme preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-48 flex items-center justify-center border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Restricted Access</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
