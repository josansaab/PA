import { AppLayout } from "@/components/layout/app-layout";
import { Car as CarIcon, Wrench, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCars, getCarServices, createCar, updateCar, deleteCar, createCarService, updateCarService, deleteCarService } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { Car, InsertCar, CarService, InsertCarService } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function CarMaintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingService, setEditingService] = useState<CarService | null>(null);
  
  const [carFormData, setCarFormData] = useState<InsertCar>({
    name: "",
    make: null,
    model: null,
    year: null,
    licensePlate: null,
    vin: null,
    notes: null,
  });
  
  const [serviceFormData, setServiceFormData] = useState<InsertCarService>({
    carId: null,
    type: "Service",
    date: null,
    km: null,
    notes: null,
    status: "Upcoming",
  });

  const { data: cars = [] } = useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["car-services"],
    queryFn: getCarServices,
  });

  const createCarMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast({ title: "Car added" });
      resetCarForm();
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertCar> }) => updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast({ title: "Car updated" });
      resetCarForm();
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast({ title: "Car deleted" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: createCarService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-services"] });
      toast({ title: "Service log added" });
      resetServiceForm();
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertCarService> }) => updateCarService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-services"] });
      toast({ title: "Service updated" });
      resetServiceForm();
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteCarService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-services"] });
      toast({ title: "Service deleted" });
    },
  });

  const resetCarForm = () => {
    setCarFormData({ name: "", make: null, model: null, year: null, licensePlate: null, vin: null, notes: null });
    setEditingCar(null);
    setIsCarDialogOpen(false);
  };

  const resetServiceForm = () => {
    setServiceFormData({ carId: null, type: "Service", date: null, km: null, notes: null, status: "Upcoming" });
    setEditingService(null);
    setIsServiceDialogOpen(false);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarFormData({
      name: car.name,
      make: car.make,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate,
      vin: car.vin,
      notes: car.notes,
    });
    setIsCarDialogOpen(true);
  };

  const handleEditService = (service: CarService) => {
    setEditingService(service);
    setServiceFormData({
      carId: service.carId,
      type: service.type,
      date: service.date,
      km: service.km,
      notes: service.notes,
      status: service.status,
    });
    setIsServiceDialogOpen(true);
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      updateCarMutation.mutate({ id: editingCar.id, data: carFormData });
    } else {
      createCarMutation.mutate(carFormData);
    }
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: serviceFormData });
    } else {
      createServiceMutation.mutate(serviceFormData);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">My Vehicles</h1>
          <div className="flex gap-3">
            <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full" onClick={() => { setEditingCar(null); setCarFormData({ name: "", make: null, model: null, year: null, licensePlate: null, vin: null, notes: null }); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCar ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCarSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={carFormData.name}
                      onChange={(e) => setCarFormData({ ...carFormData, name: e.target.value })}
                      placeholder="My Tesla"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input
                        value={carFormData.make || ""}
                        onChange={(e) => setCarFormData({ ...carFormData, make: e.target.value || null })}
                        placeholder="Tesla"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        value={carFormData.model || ""}
                        onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value || null })}
                        placeholder="Model 3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={carFormData.year || ""}
                        onChange={(e) => setCarFormData({ ...carFormData, year: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>License Plate</Label>
                      <Input
                        value={carFormData.licensePlate || ""}
                        onChange={(e) => setCarFormData({ ...carFormData, licensePlate: e.target.value || null })}
                        placeholder="ABC-123"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetCarForm}>Cancel</Button>
                    <Button type="submit">{editingCar ? "Update" : "Add"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary" onClick={() => { setEditingService(null); resetServiceForm(); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Service Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add Service Log"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select value={serviceFormData.type} onValueChange={(v) => setServiceFormData({ ...serviceFormData, type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Tyres">Tyres</SelectItem>
                          <SelectItem value="Registration">Registration</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status *</Label>
                      <Select value={serviceFormData.status} onValueChange={(v) => setServiceFormData({ ...serviceFormData, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={serviceFormData.date || ""}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, date: e.target.value || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Odometer (km)</Label>
                      <Input
                        type="number"
                        value={serviceFormData.km || ""}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, km: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="45000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={serviceFormData.notes || ""}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, notes: e.target.value || null })}
                      placeholder="Service details..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetServiceForm}>Cancel</Button>
                    <Button type="submit">{editingService ? "Update" : "Add"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cars List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl" />
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditCar(car)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteCarMutation.mutate(car.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="flex gap-4 relative z-10">
                <div className="h-16 w-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <CarIcon className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">{car.name}</h2>
                  <p className="text-slate-500">{car.make} {car.model} {car.year}</p>
                  {car.licensePlate && (
                    <p className="text-xs text-slate-400 mt-1">License: {car.licensePlate}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {cars.length === 0 && (
            <div className="col-span-full glass-card p-8 rounded-3xl text-center text-slate-500">
              No vehicles added yet. Click "Add Vehicle" to get started!
            </div>
          )}
        </div>

        {/* Service Timeline */}
        <div className="space-y-4">
           <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Service History</h3>
           <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
              {services.map((service) => (
                <div key={service.id} className="relative pl-8 group">
                   <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-blue-500" />
                   <div className="glass-card p-5 rounded-xl">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <Wrench className="h-5 w-5 text-slate-400" />
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{service.type}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm text-slate-500">{service.date}</span>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditService(service)}>
                               <Pencil className="h-3 w-3" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteServiceMutation.mutate(service.id)}>
                               <Trash2 className="h-3 w-3 text-destructive" />
                             </Button>
                           </div>
                         </div>
                      </div>
                      {service.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{service.notes}</p>
                      )}
                      {service.km && (
                        <p className="text-xs text-slate-400 mt-1">Odometer: {service.km.toLocaleString()} km</p>
                      )}
                   </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="pl-8 text-slate-500">
                  No service history found. Add your first service record!
                </div>
              )}
           </div>
        </div>
      </div>
    </AppLayout>
  );
}
