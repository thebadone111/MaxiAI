import PrimaryButton from "./primary_button"

function Feedback({ header, para, text_arr, button }) {
    const text_cards = <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {text_arr.map((item, index) => (
                <div
                key={index}
                className="flex-1 border-[#eb2353] border-3 p-10 rounded-3xl flex flex-col justify-between"
                >
                {item[0]}
                {item[1]}
            </div>
        ))}
    </div>

    return (
        <>
            <section className="py-16 px-8 text-center ">
                <div className="flex flex-col lg:gap-10 items-center">
                    <h1 className="mb-8 text-3xl md:text-5xl font-semibold leading-tight italic">
                        {header}
                    </h1>
                    <p className="mb-8 md:text-2xl">
                        {para}
                    </p>
                    <div className="flex flex-col md:flex-row gap-5 lg:gap-10">
                        {text_cards}
                    </div>
                    <div className="mt-15 lg:mb-10 lg:mr-10">
                        {button && <PrimaryButton />}
                    </div>
                </div>
            </section>
            
        </>
    )
}
export default Feedback