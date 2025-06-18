
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDevices, useAddDevice, useDeleteDevice } from "@/hooks/useDevices";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DevicesPage = () => {
  const { data: devices = [], isLoading } = useDevices();
  const addDeviceMutation = useAddDevice();
  const deleteDeviceMutation = useDeleteDevice();
  const { toast } = useToast();
  
  const [newDevice, setNewDevice] = useState({
    name: "",
    location: "",
    type: "Environmental"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddDevice = async () => {
    if (!newDevice.name.trim()) {
      toast({
        title: "Error",
        description: "Device name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDeviceMutation.mutateAsync({
        name: newDevice.name,
        location: newDevice.location,
        type: newDevice.type,
        status: "offline"
      });
      
      setNewDevice({
        name: "",
        location: "",
        type: "Environmental"
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Device added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDevice = async (id: string) => {
    try {
      await deleteDeviceMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Device removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove device",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading devices...</div>
        </div>
      </MainLayout>
    );
  }

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "border-green-500 text-green-500 bg-green-50 dark:bg-green-950/30";
      case "offline": return "border-gray-500 text-gray-500 bg-gray-50 dark:bg-gray-950/30";
      default: return "border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Device Management</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select 
                    id="type"
                    value={newDevice.type}
                    onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Security">Security</option>
                    <option value="Power">Power</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddDevice}
                  disabled={addDeviceMutation.isPending}
                >
                  {addDeviceMutation.isPending ? "Adding..." : "Add Device"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center py-4">
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No devices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-mono text-sm">{device.id}</TableCell>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.location || "Unknown"}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(device.status)}
                        >
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {device.last_seen ? formatDistanceToNow(parseISO(device.last_seen), { addSuffix: true }) : "Never"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => handleRemoveDevice(device.id)}
                          disabled={deleteDeviceMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border rounded-md p-4">
                <dt className="text-sm font-medium text-muted-foreground">Total Devices</dt>
                <dd className="mt-1 text-3xl font-semibold">{devices.length}</dd>
              </div>
              <div className="border rounded-md p-4">
                <dt className="text-sm font-medium text-muted-foreground">Online</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {devices.filter(d => d.status === "online").length}
                </dd>
              </div>
              <div className="border rounded-md p-4">
                <dt className="text-sm font-medium text-muted-foreground">Offline/Warning</dt>
                <dd className="mt-1 text-3xl font-semibold text-amber-600">
                  {devices.filter(d => d.status !== "online").length}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DevicesPage;
