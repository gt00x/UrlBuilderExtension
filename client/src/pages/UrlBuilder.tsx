import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { formatCustomDate, getRelativeTime } from "@/lib/date-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Link as LinkIcon, 
  Database, 
  AlertTriangle, 
  Search, 
  Settings, 
  ExternalLink, 
  Copy,
  RotateCcw,
  Plus,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const BASE_URLS = [
  "https://api.timeseries.dev/v1",
  "https://stage.timeseries.dev/v1",
  "https://prod-eu.timeseries.io/query",
  "https://prod-us.timeseries.io/query",
  "http://localhost:8080/api"
];

const PREDEFINED_FACILITIES = [
  "facility-alpha",
  "facility-beta",
  "sensor-cluster-1",
  "sensor-cluster-2",
  "main-generator",
  "backup-generator"
];

type FormValues = {
  baseUrl: string;
  startTime: string; // We'll store as string in custom format or ISO for internal logic
  endTime: string;
  facilities: string[];
  customFacility: string;
  severities: string[];
  filterText: string;
  isRegex: boolean;
  staticFields: { key: string; value: string; active: boolean }[];
};

const DEFAULT_STATIC_FIELDS = [
  { key: "limit", value: "500", active: true },
  { key: "format", value: "json", active: false },
  { key: "debug", value: "true", active: false }
];

export default function UrlBuilder() {
  const { toast } = useToast();
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  
  const { control, register, watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      baseUrl: BASE_URLS[0],
      startTime: "",
      endTime: "",
      facilities: [],
      customFacility: "",
      severities: ["INFO", "Warning", "Error"],
      filterText: "",
      isRegex: false,
      staticFields: DEFAULT_STATIC_FIELDS
    }
  });

  const values = watch();

  // Initialize times on mount
  useEffect(() => {
    const now = new Date();
    const oneHourAgo = getRelativeTime(1, 'hours');
    setValue("endTime", formatCustomDate(now));
    setValue("startTime", formatCustomDate(oneHourAgo));
  }, [setValue]);

  const setRelativeTime = (amount: number, unit: 'minutes' | 'hours' | 'days') => {
    const now = new Date();
    const start = getRelativeTime(amount, unit);
    setValue("endTime", formatCustomDate(now));
    setValue("startTime", formatCustomDate(start));
    
    toast({
      title: "Time Updated",
      description: `Set range to last ${amount} ${unit}`,
    });
  };

  const addCustomFacility = () => {
    if (values.customFacility && !customFacilities.includes(values.customFacility)) {
      setCustomFacilities([...customFacilities, values.customFacility]);
      setValue("facilities", [...values.facilities, values.customFacility]);
      setValue("customFacility", "");
    }
  };

  const removeFacility = (facility: string) => {
    setValue("facilities", values.facilities.filter(f => f !== facility));
    if (customFacilities.includes(facility)) {
      setCustomFacilities(customFacilities.filter(f => f !== facility));
    }
  };

  const toggleSeverity = (severity: string) => {
    const current = values.severities;
    if (current.includes(severity)) {
      setValue("severities", current.filter(s => s !== severity));
    } else {
      setValue("severities", [...current, severity]);
    }
  };

  const toggleStaticField = (index: number) => {
    const fields = [...values.staticFields];
    fields[index].active = !fields[index].active;
    setValue("staticFields", fields);
  };

  const updateStaticField = (index: number, field: keyof typeof values.staticFields[0], val: string) => {
    const fields = [...values.staticFields];
    // @ts-ignore
    fields[index][field] = val;
    setValue("staticFields", fields);
  };

  // Construct URL
  const constructUrl = () => {
    try {
      let url = values.baseUrl;
      if (!url.endsWith('/')) url += '/';
      
      const params: string[] = [];
      
      if (values.startTime) params.push(`start=${values.startTime}`);
      if (values.endTime) params.push(`end=${values.endTime}`);
      
      values.facilities.forEach(f => params.push(`facility=${encodeURIComponent(f)}`));
      
      values.severities.forEach(s => params.push(`s=${encodeURIComponent(s)}`));
      
      if (values.filterText) {
        const text = values.isRegex ? `~"${values.filterText}"` : `"${values.filterText}"`;
        params.push(`m=${encodeURIComponent(text)}`);
      }
      
      values.staticFields.forEach(field => {
        if (field.active && field.key) {
          params.push(`${field.key}=${encodeURIComponent(field.value)}`);
        }
      });
      
      return url + (params.length > 0 ? '?' + params.join('&') : '');
    } catch (e) {
      return "Error constructing URL";
    }
  };

  const generatedUrl = constructUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  const openInNewTab = () => {
    window.open(generatedUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex justify-center font-sans">
      <Card className="w-full max-w-4xl shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-primary" />
                Query Builder
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Construct complex time-series queries for your data sources.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs bg-secondary/50">v1.0.0</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full">
            
            {/* LEFT COLUMN - CONTROLS */}
            <div className="md:col-span-7 p-6 space-y-8 border-r border-border/50">
              
              {/* 1. Base URL */}
              <section className="space-y-3">
                <Label className="text-sm font-medium text-primary flex items-center gap-2">
                  <Database className="w-4 h-4" /> Base Configuration
                </Label>
                <Select 
                  value={values.baseUrl} 
                  onValueChange={(val) => setValue("baseUrl", val)}
                >
                  <SelectTrigger className="w-full font-mono text-sm">
                    <SelectValue placeholder="Select Base URL" />
                  </SelectTrigger>
                  <SelectContent>
                    {BASE_URLS.map((url, i) => (
                      <SelectItem key={i} value={url} className="font-mono text-xs">{url}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              {/* 2. Time Selection */}
              <section className="space-y-3">
                <Label className="text-sm font-medium text-primary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time Range
                </Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input 
                      {...register("startTime")} 
                      className="font-mono text-xs" 
                      placeholder="yy.DDD.hh.mm.ss.SSS"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <Input 
                      {...register("endTime")} 
                      className="font-mono text-xs" 
                      placeholder="yy.DDD.hh.mm.ss.SSS"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { l: "-15m", v: 15, u: 'minutes' },
                    { l: "-1h", v: 1, u: 'hours' },
                    { l: "-2h", v: 2, u: 'hours' },
                    { l: "-1d", v: 1, u: 'days' },
                    { l: "-2d", v: 2, u: 'days' },
                    { l: "-5d", v: 5, u: 'days' },
                  ].map((opt, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs bg-secondary/30 hover:bg-primary/10 hover:text-primary border-dashed"
                      onClick={() => setRelativeTime(opt.v, opt.u as any)}
                    >
                      {opt.l}
                    </Button>
                  ))}
                </div>
              </section>

              {/* 3. Filters & Text */}
              <section className="space-y-3">
                <Label className="text-sm font-medium text-primary flex items-center gap-2">
                  <Search className="w-4 h-4" /> Filters
                </Label>
                
                <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-secondary/10">
                  {/* Severity */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Severity</Label>
                    <div className="flex gap-4">
                      {["INFO", "Warning", "Error"].map(sev => (
                        <div key={sev} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sev-${sev}`} 
                            checked={values.severities.includes(sev)}
                            onCheckedChange={() => toggleSeverity(sev)}
                          />
                          <label 
                            htmlFor={`sev-${sev}`} 
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              sev === 'Error' ? 'text-red-400' : sev === 'Warning' ? 'text-yellow-400' : 'text-blue-400'
                            }`}
                          >
                            {sev}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Message Filter</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="regex-mode" 
                          checked={values.isRegex}
                          onCheckedChange={(checked) => setValue("isRegex", checked)}
                        />
                        <Label htmlFor="regex-mode" className="text-xs font-mono">Regex (~)</Label>
                      </div>
                    </div>
                    <div className="relative">
                      <Input 
                        {...register("filterText")}
                        placeholder={values.isRegex ? "e.g. ^[0-9]+ error" : "e.g. connection timeout"}
                        className="font-mono text-sm pl-9"
                      />
                      <span className="absolute left-3 top-2.5 text-muted-foreground font-mono text-sm">
                        {values.isRegex ? "~" : "T"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN - CONFIG & PREVIEW */}
            <div className="md:col-span-5 flex flex-col bg-secondary/5 h-full">
              
              <div className="p-6 flex-1 space-y-8">
                {/* 4. Facilities */}
                <section className="space-y-3">
                  <Label className="text-sm font-medium text-primary flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Facilities
                  </Label>
                  
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={(val) => {
                      if (!values.facilities.includes(val)) {
                        setValue("facilities", [...values.facilities, val]);
                      }
                    }}>
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Add predefined..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_FACILITIES.map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Custom facility..." 
                      value={values.customFacility}
                      onChange={(e) => setValue("customFacility", e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFacility())}
                      className="text-xs"
                    />
                    <Button size="icon" variant="secondary" onClick={addCustomFacility} className="shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded border border-dashed border-border/60 bg-background/50">
                    {values.facilities.length === 0 && (
                      <span className="text-xs text-muted-foreground w-full text-center self-center italic">No facilities selected</span>
                    )}
                    {values.facilities.map(f => (
                      <Badge key={f} variant="secondary" className="pl-2 pr-1 py-0.5 text-xs flex items-center gap-1 group">
                        {f}
                        <button onClick={() => removeFacility(f)} className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </section>

                {/* 5. Static Fields */}
                <section className="space-y-3">
                  <Label className="text-sm font-medium text-primary flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Static Parameters
                  </Label>
                  
                  <div className="space-y-2">
                    {values.staticFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Checkbox 
                          checked={field.active}
                          onCheckedChange={() => toggleStaticField(idx)}
                        />
                        <Input 
                          value={field.key}
                          onChange={(e) => updateStaticField(idx, 'key', e.target.value)}
                          className={`h-8 text-xs font-mono ${!field.active && 'opacity-50'}`}
                          placeholder="Key"
                        />
                        <span className="text-muted-foreground">=</span>
                        <Input 
                          value={field.value}
                          onChange={(e) => updateStaticField(idx, 'value', e.target.value)}
                          className={`h-8 text-xs font-mono ${!field.active && 'opacity-50'}`}
                          placeholder="Value"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* URL Preview & Actions - Sticky Bottom */}
              <div className="p-4 bg-card border-t border-border/50 mt-auto">
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">Generated URL Preview</Label>
                <div className="relative mb-4">
                  <ScrollArea className="h-24 w-full rounded-md border border-input bg-muted/30 p-3 font-mono text-xs break-all text-primary">
                    {generatedUrl}
                  </ScrollArea>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button 
                  className="w-full font-bold shadow-lg hover:shadow-primary/20 transition-all" 
                  size="lg"
                  onClick={openInNewTab}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Launch Query
                </Button>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
