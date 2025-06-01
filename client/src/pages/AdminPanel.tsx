import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertMaterialSchema, insertVendorSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, Save } from "lucide-react";

const materialFormSchema = insertMaterialSchema.extend({
  tensileStrength: z.string().optional(),
  flexuralStrength: z.string().optional(),
  impactStrength: z.string().optional(),
  elongationAtBreak: z.string().optional(),
  meltingTemperature: z.string().optional(),
  heatDeflectionTemp: z.string().optional(),
  vicatSofteningPoint: z.string().optional(),
  thermalExpansion: z.string().optional(),
  density: z.string().optional(),
  mfr: z.string().optional(),
  waterAbsorption: z.string().optional(),
  shoreHardness: z.string().optional(),
});

const vendorFormSchema = insertVendorSchema;

type MaterialFormData = z.infer<typeof materialFormSchema>;
type VendorFormData = z.infer<typeof vendorFormSchema>;

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("materials");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors = [] } = useQuery({
    queryKey: ['/api/vendors'],
  });

  const materialForm = useForm<MaterialFormData>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      materialType: "",
      description: "",
      color: "",
      transparency: "",
      fdaApproved: false,
      rohsCompliant: false,
      reachCompliant: false,
    },
  });

  const vendorForm = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      website: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      // Convert string numbers to actual numbers for numeric fields
      const processedData = {
        ...data,
        tensileStrength: data.tensileStrength ? data.tensileStrength : null,
        flexuralStrength: data.flexuralStrength ? data.flexuralStrength : null,
        impactStrength: data.impactStrength ? data.impactStrength : null,
        elongationAtBreak: data.elongationAtBreak ? data.elongationAtBreak : null,
        meltingTemperature: data.meltingTemperature ? data.meltingTemperature : null,
        heatDeflectionTemp: data.heatDeflectionTemp ? data.heatDeflectionTemp : null,
        vicatSofteningPoint: data.vicatSofteningPoint ? data.vicatSofteningPoint : null,
        thermalExpansion: data.thermalExpansion ? data.thermalExpansion : null,
        density: data.density ? data.density : null,
        mfr: data.mfr ? data.mfr : null,
        waterAbsorption: data.waterAbsorption ? data.waterAbsorption : null,
        shoreHardness: data.shoreHardness ? Number(data.shoreHardness) || null : null,
      };

      await apiRequest('POST', '/api/materials', processedData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Material created successfully",
      });
      materialForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create material",
        variant: "destructive",
      });
    },
  });

  const createVendorMutation = useMutation({
    mutationFn: async (data: VendorFormData) => {
      await apiRequest('POST', '/api/vendors', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });
      vendorForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
    },
  });

  const onSubmitMaterial = (data: MaterialFormData) => {
    createMaterialMutation.mutate(data);
  };

  const onSubmitVendor = (data: VendorFormData) => {
    createVendorMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage materials and vendors in the database</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">Add Material</TabsTrigger>
            <TabsTrigger value="vendors">Add Vendor</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...materialForm}>
                  <form onSubmit={materialForm.handleSubmit(onSubmitMaterial)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={materialForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Cycolac ABS MG47" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={materialForm.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., SABIC" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={materialForm.control}
                        name="materialType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select material type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ABS">ABS</SelectItem>
                                <SelectItem value="PLA">PLA</SelectItem>
                                <SelectItem value="PETG">PETG</SelectItem>
                                <SelectItem value="PA">Nylon (PA)</SelectItem>
                                <SelectItem value="PC">Polycarbonate (PC)</SelectItem>
                                <SelectItem value="POM">Acetal (POM)</SelectItem>
                                <SelectItem value="PEEK">PEEK</SelectItem>
                                <SelectItem value="PP">Polypropylene (PP)</SelectItem>
                                <SelectItem value="PE">Polyethylene (PE)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={materialForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Natural, Black, White" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={materialForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Material description and properties..."
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mechanical Properties */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Mechanical Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="tensileStrength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tensile Strength (MPa)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="flexuralStrength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Flexural Strength (MPa)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="impactStrength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Impact Strength (kJ/m²)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="elongationAtBreak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Elongation at Break (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Thermal Properties */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Thermal Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="meltingTemperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Melting Temperature (°C)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="heatDeflectionTemp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heat Deflection Temp (°C)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="vicatSofteningPoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vicat Softening Point (°C)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="thermalExpansion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thermal Expansion (/°C)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.0000001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Physical Properties */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Physical Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="density"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Density (g/cm³)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="mfr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>MFR (g/10 min)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="waterAbsorption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Water Absorption (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="shoreHardness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shore Hardness</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Certifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="fdaApproved"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>FDA Approved</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="rohsCompliant"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>RoHS Compliant</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="reachCompliant"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>REACH Compliant</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={materialForm.control}
                          name="ul94Rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>UL94 Rating</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select UL94 rating" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="V-0">V-0</SelectItem>
                                  <SelectItem value="V-1">V-1</SelectItem>
                                  <SelectItem value="V-2">V-2</SelectItem>
                                  <SelectItem value="HB">HB</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createMaterialMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createMaterialMutation.isPending ? "Creating..." : "Create Material"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Vendor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...vendorForm}>
                  <form onSubmit={vendorForm.handleSubmit(onSubmitVendor)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={vendorForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vendor Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Industrial Plastics Supply" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={vendorForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input 
                                type="url" 
                                placeholder="https://example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={vendorForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="contact@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={vendorForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+1 (555) 123-4567" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createVendorMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createVendorMutation.isPending ? "Creating..." : "Create Vendor"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
