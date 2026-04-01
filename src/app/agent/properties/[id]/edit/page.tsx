"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MdDashboard,
  MdDomain,
  MdChatBubble,
  MdCalendarToday,
  MdPayments,
  MdSettings,
  MdNotifications,
  MdGridView,
  MdSearch,
  MdChevronRight,
  MdEdit,
  MdDelete,
  MdAddAPhoto,
  MdUnfoldMore,
  MdLocationOn,
  MdArrowBack,
} from "react-icons/md";

interface PropertyImage {
  id: string;
  url: string;
  is_primary?: boolean;
  display_order?: number;
}

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: string;
  listing_type: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  images: PropertyImage[];
}

export default function AgentEditProperty() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    status: "active",
    tagline: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const data = await response.json();
        console.log("API Response:", data);
        setProperty(data);
        setPropertyImages(data.images || []);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          price: data.price?.toString() || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          area_sqft: data.area_sqft?.toString() || "",
          status: data.status || "active",
          tagline: data.tagline || "",
        });
        console.log("Form data set:", {
          title: data.title,
          city: data.city,
          state: data.state,
          price: data.price,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading property");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImageLink = () => {
    if (!imageLink.trim()) return;

    try {
      new URL(imageLink);
      const newImage: PropertyImage = {
        id: Date.now().toString(),
        url: imageLink,
        is_primary: propertyImages.length === 0,
      };
      setPropertyImages((prev) => [...prev, newImage]);
      setImageLink("");
    } catch (error) {
      alert("Please enter a valid URL");
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setPropertyImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const updateData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
        area_sqft: parseFloat(formData.area_sqft) || 0,
        status: formData.status,
        images: propertyImages.map((img) => ({
          url: img.url,
          is_primary: img.is_primary,
        })),
      };

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update property");
      }

      const updated = await response.json();
      setProperty(updated);
      alert("Property updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving property");
      console.error("Error saving property:", err);
      alert(
        "Failed to save property: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/agent/properties");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00132e]">
        <div className="text-white text-xl">Loading property...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00132e]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || "Property not found"}
          </div>
          <button
            onClick={() => router.push("/agent/properties")}
            className="px-6 py-3 bg-[#a9c7ff] text-[#003063] font-bold rounded-full"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-50 flex justify-between items-center px-8 w-full border-b border-[#122a4c]/20 bg-[#00132e]/60 backdrop-blur-xl h-20">
          <div className="flex items-center gap-8">
            <Link
              href="/agent/properties"
              className="flex items-center gap-2 text-[#a9c7ff] hover:text-white transition-colors"
            >
              <MdArrowBack size={24} />
              <span className="hidden md:block text-xl font-inter text-white tracking-tighter">
                AESTHETE
              </span>
            </Link>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-[#a9c7ff]/50" size={20} />
              </div>
              <input
                className="bg-[#191c21] border-none focus:ring-1 focus:ring-[#a9c7ff]/30 text-xs text-white placeholder:text-[#a9c7ff]/30 pl-10 pr-4 py-2 w-64 transition-all"
                placeholder="Search listing ID, client, or tag..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="p-2 text-[#a9c7ff]/70 hover:text-white transition-colors relative">
                <MdNotifications size={20} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#a9c7ff] rounded-full"></span>
              </button>
              <button className="p-2 text-[#a9c7ff]/70 hover:text-white transition-colors">
                <MdGridView size={20} />
              </button>
            </div>
            <div className="h-6 w-[1px] bg-[#122a4c]/40"></div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#a9c7ff] text-[#003063] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        <div
          className="flex-1 overflow-y-auto bg-[#111318]"
          style={{ scrollbarWidth: "thin" }}
        >
          <section className="px-12 pt-16 pb-8 max-w-7xl mx-auto w-full">
            <nav className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.2em] text-[#a9c7ff]/40 font-bold">
              <Link
                href="/agent/properties"
                className="hover:text-[#a9c7ff]/70"
              >
                Portfolio
              </Link>
              <MdChevronRight size={14} />
              <span className="text-[#a9c7ff]/70">{property.title}</span>
              <MdChevronRight size={14} />
              <span className="text-[#a9c7ff]">Edit</span>
            </nav>
            <div className="flex justify-between items-end gap-12 border-b border-[#122a4c]/20 pb-12">
              <div className="flex-1">
                <h1 className="text-7xl font-inter text-white leading-[0.9] tracking-tighter mb-4">
                  {property.title}
                </h1>
                <p className="text-lg text-[#a9c7ff]/60 max-w-2xl leading-relaxed">
                  Refining the architectural narrative. Update listing details,
                  media assets, and market status below.
                </p>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-3 bg-[#282a2f]/40 p-1.5 rounded-full border border-[#122a4c]/40">
                  <span className="px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-[#c2c6d3]">
                    {property.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a9c7ff]/40">
                  ID: {property.id}
                </span>
              </div>
            </div>
          </section>

          <section className="px-12 py-12 max-w-7xl mx-auto w-full grid grid-cols-12 gap-16">
            <div className="col-span-12 lg:col-span-7 space-y-12">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-inter tracking-[0.25em] uppercase text-white">
                    Editorial Media
                  </h3>
                  <button className="text-[10px] font-bold tracking-widest uppercase text-[#a9c7ff] border-b border-[#a9c7ff]/30 hover:border-[#a9c7ff] transition-all">
                    Add Media
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="Add image URL (https://...)"
                      className="flex-1 bg-[#191c21] border border-[#8c919d]/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:ring-0 focus:border-[#a9c7ff] transition-colors"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageLink();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddImageLink}
                      disabled={!imageLink.trim()}
                      className="px-4 py-3 bg-[#a9c7ff]/20 text-[#a9c7ff] font-medium text-sm rounded-full hover:bg-[#a9c7ff]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Link
                    </button>
                  </div>

                  {propertyImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyImages.map((image, index) => (
                        <div
                          key={image.id || index}
                          className="aspect-square relative group overflow-hidden rounded-sm border border-[#122a4c]"
                        >
                          <img
                            src={image.url}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23191c21"/><text x="50" y="50" font-size="10" fill="%23a9c7ff" text-anchor="middle" dy=".3em">No Image</text></svg>';
                            }}
                          />
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {image.is_primary && (
                              <span className="px-2 py-1 bg-[#a9c7ff] text-[#003063] text-[10px] font-bold rounded">
                                Primary
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveImage(image.id)}
                              className="w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-500"
                            >
                              <MdDelete size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="aspect-square rounded-sm border-2 border-dashed border-[#8c919d]/30 flex flex-col items-center justify-center cursor-pointer hover:border-[#a9c7ff]/50 transition-colors bg-[#191c21]/50">
                        <MdAddAPhoto className="w-8 h-8 text-[#a9c7ff]/50 mb-2" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#a9c7ff]/50 text-center px-2">
                          Add More
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 aspect-[16/9] relative group overflow-hidden rounded-sm cursor-pointer bg-[#191c21] border border-dashed border-[#122a4c] flex items-center justify-center">
                      <MdAddAPhoto className="text-[#a9c7ff] mb-2" size={32} />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#a9c7ff]/50 ml-2">
                        No images - Add some above
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-inter tracking-[0.25em] uppercase text-white">
                  Property Details
                </h3>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]/40 mb-3">
                      Property Title *
                    </label>
                    <input
                      className="w-full bg-transparent border-b border-[#8c919d]/30 focus:border-[#a9c7ff] transition-colors py-4 text-xl font-medium text-white outline-none"
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter property title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]/40 mb-3">
                        City *
                      </label>
                      <input
                        className="w-full bg-transparent border-b border-[#8c919d]/30 focus:border-[#a9c7ff] transition-colors py-3 text-white outline-none"
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="City"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]/40 mb-3">
                        State *
                      </label>
                      <input
                        className="w-full bg-transparent border-b border-[#8c919d]/30 focus:border-[#a9c7ff] transition-colors py-3 text-white outline-none"
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]/40 mb-3">
                      Address
                    </label>
                    <input
                      className="w-full bg-transparent border-b border-[#8c919d]/30 focus:border-[#a9c7ff] transition-colors py-3 text-white outline-none"
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Full address"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]/40 mb-3">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-[#191c21]/30 border border-[#8c919d]/15 focus:border-[#a9c7ff]/50 transition-colors p-6 text-white leading-relaxed text-sm resize-none outline-none"
                      rows={6}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the property..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-12">
              <div
                className="p-10 border border-[#122a4c]/30 rounded-sm"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <h3 className="text-xs font-inter tracking-[0.25em] uppercase text-white mb-10">
                  Market Configuration
                </h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c7ff]/40 mb-2">
                      Listing Price *
                    </label>
                    <div className="flex items-center gap-2 border-b border-[#8c919d]/30 py-2">
                      <span className="text-[#a9c7ff] font-bold">$</span>
                      <input
                        className="bg-transparent border-none text-lg font-bold text-white focus:ring-0 w-full p-0"
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-inter tracking-[0.2em] uppercase text-[#a9c7ff]/70">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#a9c7ff]/30 font-bold">
                          Bedrooms
                        </span>
                        <input
                          className="bg-[#1d2025] border-none text-white font-bold p-2 text-sm focus:ring-1 focus:ring-[#a9c7ff]/30"
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            handleInputChange("bedrooms", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#a9c7ff]/30 font-bold">
                          Bathrooms
                        </span>
                        <input
                          className="bg-[#1d2025] border-none text-white font-bold p-2 text-sm focus:ring-1 focus:ring-[#a9c7ff]/30"
                          type="number"
                          value={formData.bathrooms}
                          onChange={(e) =>
                            handleInputChange("bathrooms", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#a9c7ff]/30 font-bold">
                          Square Feet
                        </span>
                        <input
                          className="bg-[#1d2025] border-none text-white font-bold p-2 text-sm focus:ring-1 focus:ring-[#a9c7ff]/30"
                          type="text"
                          value={formData.area_sqft}
                          onChange={(e) =>
                            handleInputChange("area_sqft", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c7ff]/40 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full bg-[#1d2025] border-none text-white font-bold p-3 text-sm focus:ring-1 focus:ring-[#a9c7ff]/30"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-inter tracking-[0.25em] uppercase text-white">
                  Visibility & Access
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#191c21]/30 rounded-lg">
                    <span className="text-sm text-white">Public Listing</span>
                    <button className="w-12 h-6 bg-[#a9c7ff] rounded-full relative transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#191c21]/30 rounded-lg">
                    <span className="text-sm text-white">
                      Featured Property
                    </span>
                    <button className="w-12 h-6 bg-[#a9c7ff]/30 rounded-full relative transition-colors">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full transition-transform"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-12 py-12 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center border-t border-[#122a4c]/20 pt-8">
              <button
                onClick={handleCancel}
                className="text-[#c2c6d3] hover:text-white transition-colors"
              >
                Cancel Changes
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    router.push(`/agent/properties/${property.id}`)
                  }
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-full hover:bg-white/10 transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-[#a9c7ff] text-[#003063] font-bold text-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish Changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
