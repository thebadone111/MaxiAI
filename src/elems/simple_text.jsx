function SimpleText ( {text} ) {
    return (
        <section className="relative h-[30vh] bg-black flex items-center justify-center px-4">
            {/* blue top bar */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-brand to-[#3C4DFF]" />

            {/* subtle center glow */}  
            <div className="pointer-events-none absolute inset-0
                  bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08),_transparent_70%)]" />

            
            <p className="text-white text-center text-2xl md:text-4xl font-bold max-w-5xl glow-text-strong">
                {text}      
            </p>

            {/* Diagonal to next white section */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-white
                            [clip-path:polygon(0%_0%,100%_100%,0%_100%)]" />
        </section>
    )
}
export default SimpleText