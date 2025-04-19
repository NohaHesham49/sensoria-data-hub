
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [pollingInterval, setPollingInterval] = useState(5);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);
  const [humidityThreshold, setHumidityThreshold] = useState(80);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="alerts">Alert Thresholds</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Refresh Settings</CardTitle>
                <CardDescription>Configure how often the dashboard fetches new data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="polling">Data Polling Interval (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="polling" 
                      type="number" 
                      min="1" 
                      max="60" 
                      value={pollingInterval} 
                      onChange={(e) => setPollingInterval(parseInt(e.target.value))} 
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      Dashboard will refresh every {pollingInterval} seconds
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="websocket">Use WebSocket (if available)</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="websocket" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Enables real-time updates when available
                    </span>
                  </div>
                </div>
                
                <Button className="mt-4">Save Settings</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize how data is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Temperature Unit</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="celsius" name="temp-unit" defaultChecked />
                      <label htmlFor="celsius">Celsius (°C)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="fahrenheit" name="temp-unit" />
                      <label htmlFor="fahrenheit">Fahrenheit (°F)</label>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-4">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>Set up email alerts for sensor threshold breaches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-alerts" 
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                  />
                  <Label htmlFor="email-alerts">Enable Email Alerts</Label>
                </div>
                
                {emailAlerts && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Alert Email Address</Label>
                      <Input id="email" type="email" placeholder="your-email@example.com" />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-lg font-medium">Threshold Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Receive alerts when sensors exceed these thresholds
                    </p>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="temp-threshold">Temperature Threshold (°C)</Label>
                        <div className="flex items-center gap-4">
                          <Input 
                            id="temp-threshold" 
                            type="number" 
                            value={temperatureThreshold} 
                            onChange={(e) => setTemperatureThreshold(parseInt(e.target.value))} 
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">
                            Alert when temperature exceeds {temperatureThreshold}°C
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="humidity-threshold">Humidity Threshold (%)</Label>
                        <div className="flex items-center gap-4">
                          <Input 
                            id="humidity-threshold" 
                            type="number" 
                            value={humidityThreshold} 
                            onChange={(e) => setHumidityThreshold(parseInt(e.target.value))} 
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">
                            Alert when humidity exceeds {humidityThreshold}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <Button className="mt-4">Save Alert Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="admin" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" type="text" value="sk-4927fjawljfla2932ljflajf" readOnly />
                    <Button variant="outline">Copy</Button>
                    <Button variant="outline">Reset</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this key for authenticating your IoT devices
                  </p>
                </div>
                
                <Button className="mt-4">Update Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
