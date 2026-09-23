import { useState, useEffect } from 'react';
import { Percent, Tag, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';

interface FlatDiscountSettings {
  enabled: boolean;
  percentage: number;
  banner_text: string;
}

const AdminDiscountSettings = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FlatDiscountSettings>({
    enabled: false,
    percentage: 0,
    banner_text: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'flat_discount')
        .maybeSingle();

      if (error) throw error;
      
      if (data?.value) {
        const value = data.value as unknown as FlatDiscountSettings;
        setSettings({
          enabled: value.enabled || false,
          percentage: value.percentage || 0,
          banner_text: value.banner_text || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load discount settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: {
          action: 'update_settings',
          key: 'flat_discount',
          value: JSON.parse(JSON.stringify(settings))
        }
      });

      if (error) throw error;
      toast.success('Discount settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save discount settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDisableDiscount = async () => {
    setSaving(true);
    try {
      const disabledSettings = { enabled: false, percentage: 0, banner_text: '' };
      const { error } = await supabase.functions.invoke('admin-data', {
        body: {
          action: 'update_settings',
          key: 'flat_discount',
          value: JSON.parse(JSON.stringify(disabledSettings))
        }
      });

      if (error) throw error;
      setSettings(disabledSettings);
      toast.success('Flat discount disabled');
    } catch (error) {
      console.error('Error disabling discount:', error);
      toast.error('Failed to disable discount');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Discount Settings</h2>

      {/* Flat Discount Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Percent className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-foreground">Site-Wide Flat Discount</CardTitle>
              <CardDescription className="text-slate-400">
                Apply a percentage discount to all products across the store
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-slate-400" />
              <div>
                <Label className="text-foreground font-medium">Enable Flat Discount</Label>
                <p className="text-sm text-slate-400">Show discount banner and apply to all products</p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          {/* Discount Percentage */}
          <div className="space-y-2">
            <Label className="text-slate-300">Discount Percentage (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={settings.percentage}
              onChange={(e) => setSettings({ ...settings, percentage: parseInt(e.target.value) || 0 })}
              className="bg-slate-900 border-slate-600 text-foreground max-w-32"
              placeholder="e.g., 20"
            />
            <p className="text-sm text-slate-500">Enter a value between 0 and 100</p>
          </div>

          {/* Banner Text */}
          <div className="space-y-2">
            <Label className="text-slate-300">Banner Text</Label>
            <Textarea
              value={settings.banner_text}
              onChange={(e) => setSettings({ ...settings, banner_text: e.target.value })}
              className="bg-slate-900 border-slate-600 text-foreground"
              placeholder="e.g., 🎉 MEGA SALE! Flat 20% OFF on everything!"
              rows={2}
            />
            <p className="text-sm text-slate-500">This text will appear on the homepage banner</p>
          </div>

          {/* Preview */}
          {settings.enabled && settings.percentage > 0 && (
            <div className="space-y-2">
              <Label className="text-slate-300">Banner Preview</Label>
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-center">
                <p className="text-foreground font-bold text-lg">
                  {settings.banner_text || `🎉 Flat ${settings.percentage}% OFF on all products!`}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            {settings.enabled && (
              <Button 
                variant="destructive"
                onClick={handleDisableDiscount}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Disable Discount
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Product Discounts Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Tag className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-foreground">Individual Product Discounts</CardTitle>
              <CardDescription className="text-slate-400">
                Set discounts on specific products from the Products tab
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-900 rounded-lg">
            <p className="text-slate-300 text-sm">
              To add a discount to a specific product:
            </p>
            <ol className="list-decimal list-inside text-slate-400 text-sm mt-2 space-y-1">
              <li>Go to the <strong className="text-slate-300">Products</strong> tab</li>
              <li>Click the edit button on any product</li>
              <li>Set the <strong className="text-slate-300">Original Price</strong> (the price before discount)</li>
              <li>Set the <strong className="text-slate-300">Discount %</strong> percentage</li>
              <li>The <strong className="text-slate-300">Price</strong> field should be the final discounted price</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscountSettings;
