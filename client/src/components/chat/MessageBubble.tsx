import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content?: string;
  image?: string;
  isSender: boolean;
  seen: boolean;
}

export function MessageBubble({ content, image, isSender, seen }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("flex", isSender ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 space-y-2",
          isSender ? "bubble-sender rounded-br-md" : "bubble-receiver rounded-bl-md"
        )}
      >
        {/* Image */}
        {image && (
          <img
            src={image}
            alt="sent"
            className="max-w-[250px] rounded-lg mb-2"
          />
        )}

        {/* Text */}
        {content && (
          <p
            className={cn(
              "text-sm leading-relaxed",
              isSender ? "text-foreground" : "text-foreground-muted"
            )}
          >
            {content}
          </p>
        )}

        {/* Seen ticks */}
        {isSender && (
          <div className="flex justify-end mt-1">
            {seen ? (
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Check className="w-3.5 h-3.5 text-foreground-subtle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
