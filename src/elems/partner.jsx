import PrimaryButton from "./primary_button"

function Partner({ header, para }) {
    return (
        <>
            <section className="bg-[url('/1.jpg')] bg-no-repeat bg-cover bg-center bg-black/50 bg-blend-overlay max-w-screen py-15 px-5 lg:py-45 lg:px-40 text-center text-white">    
                <h1 className="mb-15 text-3xl md:text-5xl font-semibold">
                    {header}
                </h1>
                <p className="mb-25 text-2xl">
                    {para}
                </p>
                <PrimaryButton />
            </section>
        </>
    )
}
export default Partner