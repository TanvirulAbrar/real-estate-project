"use client";

import { useState, useRef } from "react";
import {
  MdLocationOn,
  MdDomain,
  MdBed,
  MdBathtub,
  MdSquareFoot,
  MdAttachMoney,
  MdDescription,
  MdImage,
  MdPublish,
  MdArrowBack,
  MdArrowForward,
  MdClose,
  MdAdd,
} from "react-icons/md";
import Link from "next/link";

interface PropertyImage {
  id: string;
  url: string;
  file?: File;
  preview: string;
  type: "file" | "link";
}

export default function AgentAddProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyName: "",
    location: "",
    state: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    price: "",
    description: "",
  });
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, title: "Details", subtitle: "Core Information" },
    { id: 2, title: "Visuals", subtitle: "Media Portfolio" },
    { id: 3, title: "Publish", subtitle: "Market Launch" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: PropertyImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        newImages.push({
          id,
          url: preview,
          file,
          preview,
          type: "file",
        });
      }
    });

    setPropertyImages((prev) => [...prev, ...newImages]);
  };

  const handleAddImageLink = () => {
    if (!imageLink.trim()) return;

    try {
      new URL(imageLink);
      const id = Math.random().toString(36).substr(2, 9);
      const newImage: PropertyImage = {
        id,
        url: imageLink,
        preview: imageLink,
        type: "link",
      };
      setPropertyImages((prev) => [...prev, newImage]);
      setImageLink("");
    } catch (error) {
      alert("Please enter a valid URL");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  const removeImage = (id: string) => {
    setPropertyImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove && imageToRemove.type === "file") {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (
      !formData.propertyName ||
      !formData.location ||
      !formData.state ||
      !formData.price
    ) {
      alert(
        "Please fill in all required fields: Property Name, Location, State, and Price",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const locationParts = formData.location
        .split(",")
        .map((part) => part.trim());
      const city = locationParts[0] || formData.location || "";
      const address = formData.location || "";
      const state = formData.state || "";

      const propertyTypeMap: Record<string, string> = {
        villa: "house",
        penthouse: "apartment",
        apartment: "apartment",
        mansion: "house",
      };

      const propertyData = {
        title: formData.propertyName,
        description: formData.description || "",
        price: parseFloat(formData.price.replace(/[$,]/g, "")) || 0,
        address: address,
        city: city,
        state: state,
        property_type: (propertyTypeMap[formData.propertyType] ||
          "other") as any,
        listing_type: "sale" as const,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms
          ? parseFloat(formData.bathrooms)
          : undefined,
        area_sqft: formData.area
          ? parseFloat(formData.area.replace(/,/g, ""))
          : undefined,
        status: "active" as const,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("ok i am");
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (response.status === 500) {
            if (
              errorData.message?.includes("ETIMEOUT") ||
              errorData.message?.includes("MongoDB")
            ) {
              await savePropertyLocally(
                propertyData,
                "Database connection failed",
              );
              return;
            }
          } else if (response.status === 401) {
            throw new Error(
              "You are not authorized to create properties. Please log in again.",
            );
          } else if (response.status === 400) {
            throw new Error(
              errorData.message ||
                "Invalid property data. Please check your inputs.",
            );
          }

          throw new Error(
            errorData.message || `Server error: ${response.status}`,
          );
        }

        const createdProperty = await response.json();

        const fileImages = propertyImages.filter((img) => img.type === "file");
        const linkImages = propertyImages.filter((img) => img.type === "link");

        console.log("Property created successfully:", {
          property: createdProperty,
          fileImages: fileImages.length,
          linkImages: linkImages.length,
          linkImageUrls: linkImages.map((img) => img.url),
        });

        alert(
          `Property "${formData.propertyName}" created successfully! ID: ${createdProperty._id}`,
        );

        localStorage.removeItem("pendingProperties");
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          await savePropertyLocally(propertyData, "Request timed out");
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("Error submitting property:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          const propertyData = {
            title: formData.propertyName,
            description: formData.description || "",
            price: parseFloat(formData.price.replace(/[$,]/g, "")) || 0,
            address: formData.location,
            city: formData.location || "",
            state: formData.state || "",
            property_type: formData.propertyType || "other",
            listing_type: "sale",
            bedrooms: formData.bedrooms
              ? parseInt(formData.bedrooms)
              : undefined,
            bathrooms: formData.bathrooms
              ? parseFloat(formData.bathrooms)
              : undefined,
            area_sqft: formData.area
              ? parseFloat(formData.area.replace(/,/g, ""))
              : undefined,
            status: "active",
          };

          await savePropertyLocally(propertyData, "Network connection failed");
          return;
        }

        alert(error.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const savePropertyLocally = async (propertyData: any, reason: string) => {
    try {
      const storedProperties = JSON.parse(
        localStorage.getItem("pendingProperties") || "[]",
      );
      const newProperty = {
        ...propertyData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        images: propertyImages.map((img) => ({
          id: img.id,
          url: img.url,
          type: img.type,
          name: img.type === "file" ? img.file?.name : img.url,
        })),
        syncStatus: "pending",
        failureReason: reason,
      };
      storedProperties.push(newProperty);
      localStorage.setItem(
        "pendingProperties",
        JSON.stringify(storedProperties),
      );

      alert(
        `Property "${formData.propertyName}" saved locally! ${reason}. Property will be synced when connection is restored.`,
      );
      console.log("Property saved locally:", newProperty);
    } catch (localError) {
      console.error("Failed to save property locally:", localError);
      alert(
        `Property "${formData.propertyName}" could not be saved to database or locally. Please try again.`,
      );
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] overflow-x-hidden">
      <div className="flex">
        <main className="flex-1 flex items-center justify-center mt-20 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-20 relative min-h-screen">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] right-[15%] w-48 h-48 sm:w-96 sm:h-96 bg-[#a9c7ff]/5 rounded-full blur-[60px] sm:blur-[120px]"></div>
            <div className="absolute bottom-[5%] left-[10%] w-64 h-64 sm:w-[500px] sm:h-[500px] bg-[#155aaa]/10 rounded-full blur-[80px] sm:blur-[160px]"></div>
          </div>

          <div className="relative w-full max-w-5xl bg-white/5 backdrop-blur-md shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row border border-white/10">
            <div className="md:w-1/3 p-6 sm:p-8 lg:p-10 bg-[#a9c7ff]/5 border-r border-white/5 flex flex-col justify-between">
              <div>
                <div className="mb-6 sm:mb-8">
                  <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.3em] uppercase text-[#a9c7ff] mb-2 block">
                    Curation Phase 0{currentStep}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-inter font-bold text-white leading-tight tracking-tighter">
                    New Listing
                  </h1>
                </div>
                <p className="text-[#c2c6d3]/70 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-12 max-w-xs">
                  Define the essence of the property. Capture its unique
                  architectural narrative and market positioning.
                </p>

                <div className="space-y-6 sm:space-y-8 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#8c919d]/30"></div>
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 sm:gap-4 relative z-10"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ring-2 sm:ring-4 flex-shrink-0 ${
                          currentStep === step.id
                            ? "bg-[#a9c7ff] ring-[#a9c7ff]/20"
                            : currentStep > step.id
                              ? "bg-[#a9c7ff] ring-[#a9c7ff]/20"
                              : "bg-[#8c919d]"
                        }`}
                      ></div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-inter uppercase tracking-widest truncate ${
                            currentStep === step.id
                              ? "text-white"
                              : "text-[#c2c6d3]"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-[#c2c6d3]/50 hidden sm:block">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 sm:mt-12">
                <div className="h-1 w-16 sm:w-24 bg-[#a9c7ff] mb-4"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#a9c7ff]/60 font-inter">
                  Azure Editorial System v2.4
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-14 overflow-y-auto max-h-[80vh] md:max-h-none">
              {currentStep === 1 && (
                <form className="space-y-8 sm:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8 sm:gap-y-10">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Property Name
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-lg sm:text-xl font-inter font-bold text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="E.g. The Obsidian Pavilion"
                        type="text"
                        value={formData.propertyName}
                        onChange={(e) =>
                          handleInputChange("propertyName", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Location
                      </label>
                      <div className="relative">
                        <MdLocationOn className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8c919d] text-sm" />
                        <input
                          className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                          placeholder="City, Country"
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        State *
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="e.g., CA, New York"
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Property Type
                      </label>
                      <select
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors rounded-none"
                        value={formData.propertyType}
                        onChange={(e) =>
                          handleInputChange("propertyType", e.target.value)
                        }
                      >
                        <option value="" className="bg-[#00132e]">
                          Select Type
                        </option>
                        <option value="villa" className="bg-[#00132e]">
                          Villa
                        </option>
                        <option value="penthouse" className="bg-[#00132e]">
                          Penthouse
                        </option>
                        <option value="apartment" className="bg-[#00132e]">
                          Apartment
                        </option>
                        <option value="mansion" className="bg-[#00132e]">
                          Mansion
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Bedrooms
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="Number of bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) =>
                          handleInputChange("bedrooms", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Bathrooms
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="Number of bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          handleInputChange("bathrooms", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Area (sq ft)
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="Property area"
                        type="number"
                        value={formData.area}
                        onChange={(e) =>
                          handleInputChange("area", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Price
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 rounded-none"
                        placeholder="Property price"
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a9c7ff]/80 block">
                        Description
                      </label>
                      <textarea
                        className="w-full bg-transparent border-0 border-b border-[#8c919d]/30 px-0 py-2 sm:py-3 text-sm font-medium text-white focus:ring-0 focus:border-[#a9c7ff] transition-colors placeholder:text-white/10 resize-none rounded-none"
                        placeholder="Property description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </form>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="text-center">
                    <MdImage className="w-12 h-12 sm:w-16 sm:h-16 text-[#a9c7ff] mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Upload Property Images
                    </h3>
                    <p className="text-[#c2c6d3] text-sm sm:text-base mb-6 sm:mb-8">
                      Add high-quality images to showcase the property
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div
                      className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center transition-colors cursor-pointer ${
                        isDragging
                          ? "border-[#a9c7ff] bg-[#a9c7ff]/5"
                          : "border-[#8c919d]/30 hover:border-[#a9c7ff]/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={openFileDialog}
                    >
                      <MdImage className="w-8 h-8 sm:w-12 sm:h-12 text-[#8c919d] mx-auto mb-4" />
                      <p className="text-white text-sm sm:text-base mb-2">
                        Drop images here or click to upload
                      </p>
                      <p className="text-[#c2c6d3] text-xs sm:text-sm">
                        PNG, JPG up to 10MB
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={imageLink}
                          onChange={(e) => setImageLink(e.target.value)}
                          placeholder="Or add image URL (https://...)"
                          className="flex-1 bg-transparent border border-[#8c919d]/30 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white placeholder:text-white/30 focus:ring-0 focus:border-[#a9c7ff] transition-colors"
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
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-[#a9c7ff]/20 text-[#a9c7ff] font-medium text-xs sm:text-sm rounded-full hover:bg-[#a9c7ff]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>

                    {propertyImages.length > 0 && (
                      <div className="mt-6 sm:mt-8">
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                          Uploaded Images ({propertyImages.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {propertyImages.map((image) => (
                            <div
                              key={image.id}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-white/10"
                            >
                              <img
                                src={image.preview}
                                alt="Property image"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(image.id);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MdClose size={14} />
                              </button>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] sm:text-xs px-2 py-1 bg-black/60 rounded max-w-[90%] truncate">
                                  {image.type === "file"
                                    ? image.file?.name
                                    : image.url}
                                </span>
                              </div>

                              <div className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 rounded text-[10px] sm:text-xs text-white">
                                {image.type === "file" ? "File" : "Link"}
                              </div>
                            </div>
                          ))}

                          <div
                            className="aspect-square rounded-lg border-2 border-dashed border-[#8c919d]/30 flex flex-col items-center justify-center cursor-pointer hover:border-[#a9c7ff]/50 transition-colors"
                            onClick={openFileDialog}
                          >
                            <MdAdd className="w-6 h-6 sm:w-8 sm:h-8 text-[#8c919d] mb-2" />
                            <span className="text-[#c2c6d3] text-xs sm:text-sm">
                              Add More
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="text-center">
                    <MdPublish className="w-12 h-12 sm:w-16 sm:h-16 text-[#a9c7ff] mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Review & Publish
                    </h3>
                    <p className="text-[#c2c6d3] text-sm sm:text-base mb-6 sm:mb-8">
                      Review your listing before publishing
                    </p>

                    <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 text-left overflow-hidden">
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-4 truncate">
                        {formData.propertyName || "Property Name"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-[#c2c6d3]">Location:</span>
                          <p className="text-white truncate">
                            {formData.location || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">State:</span>
                          <p className="text-white truncate">
                            {formData.state || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">Type:</span>
                          <p className="text-white">
                            {formData.propertyType || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">Bedrooms:</span>
                          <p className="text-white">
                            {formData.bedrooms || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">Bathrooms:</span>
                          <p className="text-white">
                            {formData.bathrooms || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">Area:</span>
                          <p className="text-white">
                            {formData.area || "Not specified"} sq ft
                          </p>
                        </div>
                        <div>
                          <span className="text-[#c2c6d3]">Price:</span>
                          <p className="text-white">
                            {formData.price || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-[#c2c6d3]">Description:</span>
                        <p className="text-white mt-1 text-xs sm:text-sm line-clamp-3">
                          {formData.description || "No description provided"}
                        </p>
                      </div>

                      {propertyImages.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                          <span className="text-[#c2c6d3] text-xs sm:text-sm">
                            Images:
                          </span>
                          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {propertyImages.slice(0, 6).map((image) => (
                              <div
                                key={image.id}
                                className="aspect-square rounded-lg overflow-hidden border border-white/10"
                              >
                                <img
                                  src={image.preview}
                                  alt="Property preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {propertyImages.length > 6 && (
                              <button className="aspect-square rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm">
                                  +{propertyImages.length - 6}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#a9c7ff] text-[#001b3d] font-bold rounded-full hover:bg-[#a9c7ff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <MdPublish className="animate-spin" />
                      ) : (
                        "Publish Listing"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  className="bg-white flex items-center gap-2 text-[#003366] px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all"
                >
                  Next
                  <MdArrowForward />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
