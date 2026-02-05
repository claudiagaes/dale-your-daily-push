 import { useState, useRef } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { Camera, Loader2, User } from "lucide-react";
 import { toast } from "@/hooks/use-toast";
 
 interface AvatarUploadProps {
   userId: string;
   currentAvatarUrl: string | null;
   displayName: string | null;
   onUploadComplete: (url: string) => void;
 }
 
 const AvatarUpload = ({ userId, currentAvatarUrl, displayName, onUploadComplete }: AvatarUploadProps) => {
   const [isUploading, setIsUploading] = useState(false);
   const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const getInitials = (name: string | null) => {
     if (!name) return null;
     return name
       .split(" ")
       .map((n) => n[0])
       .join("")
       .toUpperCase()
       .slice(0, 2);
   };
 
   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     // Validate file type
     if (!file.type.startsWith("image/")) {
       toast({
         title: "Error",
         description: "Por favor selecciona una imagen",
         variant: "destructive",
       });
       return;
     }
 
     // Validate file size (max 5MB)
     if (file.size > 5 * 1024 * 1024) {
       toast({
         title: "Error",
         description: "La imagen debe ser menor a 5MB",
         variant: "destructive",
       });
       return;
     }
 
     setIsUploading(true);
 
     try {
       // Create file path: userId/avatar.ext
       const fileExt = file.name.split(".").pop();
       const fileName = `${userId}/avatar.${fileExt}`;
 
       // Delete old avatar if exists
       await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);
 
       // Upload new avatar
       const { error: uploadError } = await supabase.storage
         .from("avatars")
         .upload(fileName, file, { upsert: true });
 
       if (uploadError) throw uploadError;
 
       // Get public URL
       const { data: urlData } = supabase.storage
         .from("avatars")
         .getPublicUrl(fileName);
 
       const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
 
       // Update profile with new avatar URL
       const { error: updateError } = await supabase
         .from("profiles")
         .update({ avatar_url: publicUrl })
         .eq("user_id", userId);
 
       if (updateError) throw updateError;
 
       setPreviewUrl(publicUrl);
       onUploadComplete(publicUrl);
 
       toast({
         title: "¡Listo!",
         description: "Tu foto de perfil se actualizó",
       });
     } catch (error) {
       console.error("Error uploading avatar:", error);
       toast({
         title: "Error",
         description: "No pudimos subir la imagen",
         variant: "destructive",
       });
     } finally {
       setIsUploading(false);
       if (fileInputRef.current) {
         fileInputRef.current.value = "";
       }
     }
   };
 
   return (
     <div className="relative inline-block">
       <Avatar className="w-24 h-24 border-4 border-primary/20">
         <AvatarImage src={previewUrl || undefined} alt={displayName || "Avatar"} />
         <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
           {getInitials(displayName) || <User className="w-10 h-10" />}
         </AvatarFallback>
       </Avatar>
 
       <button
         type="button"
         onClick={() => fileInputRef.current?.click()}
         disabled={isUploading}
         className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
       >
         {isUploading ? (
           <Loader2 className="w-4 h-4 animate-spin" />
         ) : (
           <Camera className="w-4 h-4" />
         )}
       </button>
 
       <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         onChange={handleFileSelect}
         className="hidden"
       />
     </div>
   );
 };
 
 export default AvatarUpload;