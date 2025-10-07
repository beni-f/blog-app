"use client";
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarIcon } from "@radix-ui/react-icons";
import Image from "next/image"

export const AuthorCard = ({
  className,
  backgroundImage,
  author,
  content,
}) => {
  return (
    <div className="max-w-xs w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-xl shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 bg-cover",
          className
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div
          className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60" />
        <div className="flex flex-row items-center space-x-2 z-10">
          <div className="flex flex-row flex-wrap items-center gap-12">
            <Avatar className="rounded-4xl w-12 h-12 text-white bg-black flex items-center justify-center">
              <h1 className="text-center">{author.avatar}</h1>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {author.name}
            </p>
            {author.date && (
              <p className="text-sm text-gray-400">{author.date}</p>
            )}
          </div>
        </div>
        <div className="text content pb-5">
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4 border-1 px-2 py-1 w-fit rounded-md bg-white/20">
            {content.category}
          </p>
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {content.title}
          </h1>
        </div>
      </div>
    </div>
  );
}