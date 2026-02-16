'use client';

import { useState } from 'react';
import { Save, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DISPATCH_VIEWS } from '@/types/dispatch';
import type { DispatchView } from '@/types/dispatch';
import type { DispatchSettings } from '../types';

interface Props {
  initialSettings: DispatchSettings;
}

export function DispatchSettingsManager({ initialSettings }: Props) {
  const [settings, setSettings] = useState<DispatchSettings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<DispatchSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleView = (viewId: DispatchView) => {
    setSettings((prev) => {
      const isEnabled = prev.enabledViews.includes(viewId);
      let newEnabledViews: string[];

      if (isEnabled) {
        if (prev.enabledViews.length <= 1) {
          toast.error('At least one view must be enabled');
          return prev;
        }
        newEnabledViews = prev.enabledViews.filter((v) => v !== viewId);

        // If disabling the default view, set a new default
        const newDefaultView = prev.defaultView === viewId ? newEnabledViews[0] : prev.defaultView;
        return {
          ...prev,
          enabledViews: newEnabledViews,
          defaultView: newDefaultView,
        };
      } else {
        newEnabledViews = [...prev.enabledViews, viewId];
      }

      return {
        ...prev,
        enabledViews: newEnabledViews,
      };
    });
  };

  const handleSetDefaultView = (viewId: DispatchView) => {
    if (!settings.enabledViews.includes(viewId)) {
      toast.error('Enable the view first before setting it as default');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      defaultView: viewId,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/dispatch-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save');

      setSavedSettings(settings);
      toast.success('Dispatch settings saved successfully');
    } catch {
      setSettings(savedSettings);
      toast.error('Failed to save dispatch settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Views */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Available Views</h3>
          <p className="text-sm text-muted-foreground">Enable views your team can access</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DISPATCH_VIEWS.map((view) => {
            const isEnabled = settings.enabledViews.includes(view.id);
            const isDefault = settings.defaultView === view.id;

            return (
              <Card
                key={view.id}
                className={`transition-colors ${
                  isEnabled ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{view.label}</h4>
                        {isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{view.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs capitalize">
                        {view.tier}
                      </Badge>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggleView(view.id)}
                      aria-label={`Enable ${view.label}`}
                    />
                  </div>
                  {isEnabled && !isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 text-xs"
                      onClick={() => handleSetDefaultView(view.id)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Set as Default
                    </Button>
                  )}
                  {isEnabled && isDefault && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      This is the default view
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold">Additional Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Statistics Bar</Label>
              <p className="text-xs text-muted-foreground">
                Display job counts at the top of dispatch views
              </p>
            </div>
            <Switch
              checked={settings.showStatsBar}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showStatsBar: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Technician Filter</Label>
              <p className="text-xs text-muted-foreground">Allow filtering jobs by technician</p>
            </div>
            <Switch
              checked={settings.showTechnicianFilter}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showTechnicianFilter: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Drag &amp; Drop</Label>
              <p className="text-xs text-muted-foreground">
                Allow rescheduling and reassigning jobs via drag and drop
              </p>
            </div>
            <Switch
              checked={settings.allowDragDrop}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, allowDragDrop: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="refreshInterval">Auto-Refresh Interval</Label>
              <p className="text-xs text-muted-foreground">
                How often to refresh data (0 = manual only)
              </p>
            </div>
            <Select
              value={settings.refreshInterval.toString()}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  refreshInterval: parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Manual</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Dispatch Settings'}
        </Button>
      </div>
    </div>
  );
}
