import PrimaryButton from "./primary_button"

function Welcome({header, para, button}) {
    return (
        <section className="flex flex-col my-15 mx-5 lg:my-65 lg:mx-65 gap-5 text-center items-center max-w-screen">            
            <h1 className="text-5xl lg:text-7xl italic mb-4 font-semibold ">
                {header}
            </h1>
            <p className="text-xl md:text-2xl font-normal leading-relaxed mb-10">
                {para}
            </p>
            {button && <PrimaryButton />}
        </section>
    )
}

export default Welcome