import React from "react";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import { FiChevronRight } from "react-icons/fi";
import PostCard from "../../component/post";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section with Text Overlay */}
      <section className="relative w-full h-full">
        <img
          src="/Herro Banner-1.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-start pt-42 pl-12">
            <div className="px-8 md:px-20 max-w-xl text-black">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                One More Friend
            </h1>
            <h2 className="text-4xl md:text-5xm font-semibold mb-4">
                Thousands More Fun!
            </h2>
            <p className="text-sm md:text-xm">
                Having a pet means you have more joy, a new friend, a happy <br /> person who will always be with you to have fun. We have 200+ <br /> different pets that can meet your needs! <br /> 
            </p>
            {/* Rounded green button */}
            <button className="bg-[#A0C878] hover:bg-green-700 text-white px-9 py-3 rounded-full text-sm font-semibold transition mt-6">
                Explore Now
            </button>
            </div>
        </div>
      </section>

      <main className="pt-12 px-6">
        <div className="flex justify-between items-center mb-2">
            <div>
            <p className="text-lg mb-1">What's new?</p>
            <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                Take A Look At Some Of Our Pets
            </h2>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 border border-[#A0C878] text-[#A0C878] rounded-full text-sm hover:bg-[#A0C878] hover:text-white transition">
                View More
                <FiChevronRight className="w-4 h-4" />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center mt-8">
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
        </main>

        <section className="relative w-full h-full mt-10">
            <img
                src="/Banner-1.png"
                alt="banner"
                className="w-full h-full object-cover"
            />

            {/* Change alignment here */}
            <div className="absolute inset-0 flex items-start justify-end pt-25 pr-12">
                <div className="px-8 md:px-20 max-w-xl text-black text-right">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    One More Friend
                </h1>
                <h2 className="text-4xm md:text-3xl font-semibold mb-4">
                    🐶 84 Pets Listed!
                </h2>
                <h2 className="text-4xm md:text-3xl font-semibold mb-4">
                    🐾 23 Adoptions!
                </h2>
                <button className="bg-[#A0C878] hover:bg-green-700 text-white px-9 py-3 rounded-full text-sm font-semibold transition mt-6">
                    Explore Now
                </button>
                </div>
            </div>
        </section>

        <main className="pt-12 px-6">
        <div className="flex justify-between items-center mb-2">
            <div>
            <p className="text-lg mb-1">Hard to choose right products for your pets??</p>
            <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                Our Community
            </h2>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 border border-[#A0C878] text-[#A0C878] rounded-full text-sm hover:bg-[#A0C878] hover:text-white transition">
                View More
                <FiChevronRight className="w-4 h-4" />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-100 justify-center mt-8">
            <PostCard/>
            <PostCard/>
            <PostCard/>
            <PostCard/>
        </div>
        </main>
    </>
  );
}
