import { useState, useEffect } from "react";
import { Mail, User, Lock, Apple, Chrome } from "lucide-react";
import { Link } from "react-router-dom";

function BackgroundSlider({ images, interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);
  return (
    <div className="absolute inset-0">
      <div className="w-full h-full">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === current ? "opacity-100 scale-105 motion-safe:animate-[slow-zoom_18s_ease-in-out_infinite]" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Register(){
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => { e.preventDefault(); };
  const bgImages = [
    "https://images.unsplash.com/photo-1522402364115-7861689d1728?q=80&w=1247&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1645996831587-a9d4a73586f9?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1671552488575-3bceee973d7b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1691622500807-6d9eeb9ea06a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return(
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-black lg:bg-transparent overflow-hidden">
      <div className="hidden lg:block bg-[#f5f3e6] relative h-screen">
        <BackgroundSlider images={bgImages} interval={4500} />
      </div>
      <div className="bg-black text-white flex items-center justify-center p-8 lg:border-l lg:border-white/10 h-screen">
        <div className="w-full max-w-sm animate-[fade-up_600ms_ease-out]">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xl italic font-bold text-neon tracking-wide">NOMAD.</span>
            <Link to="/" className="rounded-lg bg-white/10 text-white px-3 py-1.5 border border-white/20 hover:bg-white/15">
              Home
            </Link>
          </div>
          <h1 className="text-3xl font-semibold">Create Your Account</h1>
          <p className="text-sm text-white/60 mt-1">Enter your details to get started.</p>


          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 bg-black/80 border border-white/15">
                <User className="w-4 h-4 text-white/70" />
                <input id="name" type="text" placeholder="John Doe" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-0" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 bg-black/80 border border-white/15">
                <Mail className="w-4 h-4 text-white/70" />
                <input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-0" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 bg-black/80 border border-white/15">
                <Lock className="w-4 h-4 text-white/70" />
                <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-0" />
              </div>
            </div>
            <button type="submit" className="w-full rounded-lg bg-white text-black py-2.5 font-medium shadow-md transition-colors hover:bg-neon hover:text-black">Sign Up</button>
          </form>

          <p className="text-xs text-white/60 text-center mt-6">By continuing, you agree to our <span className="font-medium hover:underline">Terms of Service</span> and <span className="font-medium hover:underline">Privacy Policy</span>.</p>
          <p className="text-xs text-white/60 text-center mt-2">
            Already have an account? <Link to="/login" className="font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register



// import * as React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility for classnames

// interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
//   images: string[];
//   interval?: number;
// }

// const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(
//   ({ images, interval = 5000, className, ...props }, ref) => {
//     const [currentIndex, setCurrentIndex] = React.useState(0);

//     // Effect to handle the interval-based image transition
//     React.useEffect(() => {
//       const timer = setInterval(() => {
//         setCurrentIndex((prevIndex) =>
//           prevIndex === images.length - 1 ? 0 : prevIndex + 1
//         );
//       }, interval);

//       // Cleanup the interval on component unmount
//       return () => clearInterval(timer);
//     }, [images, interval]);

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           "relative w-full h-full overflow-hidden bg-background",
//           className
//         )}
//         {...props}
//       >
//         <AnimatePresence initial={false}>
//           <motion.img
//             key={currentIndex}
//             src={images[currentIndex]}
//             alt={`Slide ${currentIndex + 1}`}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.8, ease: "easeInOut" }}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </AnimatePresence>
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//             {images.map((_, index) => (
//                 <button
//                     key={index}
//                     onClick={() => setCurrentIndex(index)}
//                     className={cn(
//                         "w-2 h-2 rounded-full transition-colors duration-300",
//                         currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white"
//                     )}
//                     aria-label={`Go to slide ${index + 1}`}
//                 />
//             ))}
//         </div>
//       </div>
//     );
//   }
// );

// ImageSlider.displayName = "ImageSlider";

// export { ImageSlider };


// demo.tsx
// // demos/image-slider-login-demo.tsx

// import * as React from "react";
// import { motion } from "framer-motion";
// import { ImageSlider } from "@/components/ui/image-slider"; // Adjust path as needed
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Chrome, Apple } from "lucide-react";

// export default function ImageSliderLoginDemo() {
//   const images = [
//     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//     "https://images.unsplash.com/photo-1754051486494-cfdbf29a589c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//     "https://images.unsplash.com/photo-1752574112194-95ccc6109ce8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEwNXx0b3dKWkZza3BHZ3x8ZW58MHx8fHx8",
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 12,
//       },
//     },
//   };

//   return (
//     <div className="w-full h-screen min-h-[700px] flex items-center justify-center bg-background p-4">
//       <motion.div 
//         className="w-full max-w-5xl h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//       >
//         {/* Left side: Image Slider */}
//         <div className="hidden lg:block">
//           <ImageSlider images={images} interval={4000} />
//         </div>

//         {/* Right side: Login Form */}
//         <div className="w-full h-full bg-card text-card-foreground flex flex-col items-center justify-center p-8 md:p-12">
//           <motion.div 
//             className="w-full max-w-sm"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2">
//               Welcome Back
//             </motion.h1>
//             <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
//               Enter your credentials to access your account.
//             </motion.p>

//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <Button variant="outline">
//                 <Chrome className="mr-2 h-4 w-4" />
//                 Google
//               </Button>
//               <Button variant="outline">
//                 <Apple className="mr-2 h-4 w-4" />
//                 Apple
//               </Button>
//             </motion.div>

//             <motion.div variants={itemVariants} className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card px-2 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </motion.div>

//             <motion.form variants={itemVariants} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="m@example.com" required />
//               </div>
//               <div className="space-y-2">
//                  <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                     <a href="#" className="text-sm font-medium text-primary hover:underline">
//                         Forgot password?
//                     </a>
//                  </div>
//                 <Input id="password" type="password" required />
//               </div>
//               <Button type="submit" className="w-full">
//                 Log In
//               </Button>
//             </motion.form>

//             <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-8">
//               Don't have an account?{" "}
//               <a href="#" className="font-medium text-primary hover:underline">
//                 Sign up
//               </a>
//             </motion.p>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// ```

// Copy-paste these files for dependencies:
// ```tsx
// originui/button
// import { Slot } from "@radix-ui/react-slot";
// import { cva, type VariantProps } from "class-variance-authority";
// import * as React from "react";

// import { cn } from "@/lib/utils";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-9 px-4 py-2",
//         sm: "h-8 rounded-lg px-3 text-xs",
//         lg: "h-10 rounded-lg px-8",
//         icon: "h-9 w-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
//     );
//   },
// );
// Button.displayName = "Button";

// export { Button, buttonVariants };

// ```
// ```tsx
// originui/input
// import { cn } from "@/lib/utils";
// import * as React from "react";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
//           type === "search" &&
//             "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
//           type === "file" &&
//             "p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
//           className,
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );
// Input.displayName = "Input";

// export { Input };

// ```
// ```tsx
// shadcn/label
// "use client"

// import * as React from "react"
// import * as LabelPrimitive from "@radix-ui/react-label"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const labelVariants = cva(
//   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
// )

// const Label = React.forwardRef<
//   React.ElementRef<typeof LabelPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
//     VariantProps<typeof labelVariants>
// >(({ className, ...props }, ref) => (
//   <LabelPrimitive.Root
//     ref={ref}
//     className={cn(labelVariants(), className)}
//     {...props}
//   />
// ))
