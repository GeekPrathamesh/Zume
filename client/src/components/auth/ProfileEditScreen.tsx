import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, ArrowLeft, Check, FileText, Sparkles, ImagePlus } from "lucide-react";



import { useAuth } from "@/context/useAuth";
import { useNavigate } from "react-router-dom";


export function ProfileEditScreen() {
  const { updateProfile, authUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [avatarPreview, setAvatarPreview] = useState<string | null>(authUser?.profilePic || null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
const [name, setName] = useState(authUser?.fullName || "");
const [bio, setBio] = useState(authUser?.bio || "");



const handleSave = async () => {
  setIsLoading(true);

  if (!selectedImage) {
    await updateProfile({ fullName: name, bio });
    navigate("/");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImage);
  reader.onload = async () => {
    const base64Image = reader.result;
    await updateProfile({
      profilePic: base64Image,
      fullName: name,
      bio,
    });
    setIsLoading(false);
    navigate("/");
  };
};




const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setSelectedImage(file);
  setAvatarPreview(URL.createObjectURL(file));
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

  const file = e.dataTransfer.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  setSelectedImage(file);                     // ✅ store file
  setAvatarPreview(URL.createObjectURL(file)); // ✅ preview
};


  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background safe-area-top safe-area-bottom overflow-y-auto">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-primary-glow rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg"
      >
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}

          className="absolute -top-12 sm:-top-14 left-0 flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors p-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Messages</span>
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel rounded-3xl p-6 sm:p-10 shadow-gold-subtle border border-primary/10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Profile Settings
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Your Profile
            </h2>
            <p className="text-sm text-foreground-muted mt-2">
              Customize how others see you
            </p>
          </div>

          {/* Avatar upload section */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {/* Animated ring */}
              <motion.div
                animate={{
                  boxShadow: isDragging
                    ? "0 0 0 4px hsl(43 76% 46% / 0.5), 0 0 40px 0 hsl(43 76% 46% / 0.3)"
                    : [
                        "0 0 0 0 hsl(43 76% 46% / 0.4)",
                        "0 0 0 20px hsl(43 76% 46% / 0)",
                      ],
                }}
                transition={{
                  duration: isDragging ? 0.2 : 2.5,
                  repeat: isDragging ? 0 : Infinity,
                  ease: "easeOut",
                }}
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-offset-4 ring-offset-background cursor-pointer ${
                  isDragging ? "ring-primary-glow" : "ring-primary/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
src={avatarPreview || "/avatar_icon.png"}
                  alt="Profile"
                  className="w-full h-full object-contain bg-black group-hover:opacity-70 transition-opacity duration-300"

                />
                
                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full"
                >
                  <ImagePlus className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs text-white/90">Upload Photo</span>
                </motion.div>
              </motion.div>
              
              {/* Camera button */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-3 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-gold"
              >
                <Camera className="w-4 h-4" />
              </motion.button>

              {/* Drag indicator */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/20 border-2 border-dashed border-primary"
                >
                  <span className="text-sm text-primary font-medium">Drop here</span>
                </motion.div>
              )}
            </motion.div>
          </div>

          <p className="text-center text-xs text-foreground-subtle mb-8">
            Click or drag & drop to upload
          </p>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Email */}
           <motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 }}
  className="space-y-2"
>
  <label className="text-sm text-foreground-muted flex items-center gap-2">
    <FileText className="w-4 h-4 text-primary" />
    Full Name
  </label>
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-4 py-3.5 bg-background-panel rounded-xl text-foreground border border-border-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
    placeholder="Your name"
  />
</motion.div>


            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-sm text-foreground-muted flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                About You
              </label>
              <div className="relative group">
                <textarea
                  value={bio}
onChange={(e) => setBio(e.target.value)}

                  rows={4}
                  maxLength={200}
                  className="w-full px-4 py-3.5 bg-background-panel rounded-xl text-foreground border border-border-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-foreground-subtle"
                  placeholder="Tell others about yourself..."
                />
                <div className="absolute -bottom-5 right-0 flex items-center gap-1.5">
  <div className="h-1 w-20 bg-background-panel rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-primary"
      initial={{ width: 0 }}
      animate={{ width: `${(bio.length / 200) * 100}%` }}
    />
  </div>
  <span className="text-[10px] text-foreground-subtle">
    {bio.length}/200
  </span>
</div>

              </div>
            </motion.div>
          </div>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground font-medium shadow-gold overflow-hidden disabled:opacity-70 transition-all group"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </span>
          </motion.button>

          {/* Footer hint */}
          <p className="text-center text-xs text-foreground-subtle mt-4">
            Your profile is visible to your contacts
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
