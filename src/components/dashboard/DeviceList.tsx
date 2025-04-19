
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Device } from "@/lib/utils/sensor-data";
import { formatDistanceToNow } from "date-fns";

export interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Connected Devices</h2>
        <Badge variant="outline">{devices.length} Devices</Badge>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      device.status === "online" 
                        ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-950/30" 
                        : device.status === "offline"
                        ? "border-gray-500 text-gray-500 bg-gray-50 dark:bg-gray-950/30"
                        : "border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                    }
                  >
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
