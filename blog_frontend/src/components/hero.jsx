import { Button } from "./ui/button";
import { Input } from "./ui/input";


export default function Hero() {
    return (
        <>
            <div className="container flex flex-col items-center py-15 mx-auto tracking-tight">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl lg:text-8xl text-center">Discover the latest blogs</h1>
                <p className="text-center  pt-3 text-gray-600 px-5 md:px-10 lg:px-30 text-md lg:text-lg">Dive into a space where writers and readers come together — explore articles from the community, discover fresh perspectives on topics that matter, and share your own thoughts to join the conversation.</p>
                <div className="flex pt-5">
                    <Input type="text" placeholder="Search articles, topics, or authors" className="mt-5 w-[300px] md:w-[500px] lg:w-[700px]" />
                    <Button className="ml-3 mt-5 bg-blue-700 font-normal">Search</Button>
                </div>
            </div>
        </>
    )
}