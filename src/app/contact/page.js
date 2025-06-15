const Contact = () => {
    return (
        <div className="flex flex-col items-center text-black justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg mb-2">For inquiries, please email us at:</p>
            <a href="mailto:support@healthcareapp.com" className="text-blue-500 hover:underline">
                support@healthcareapp.com
            </a>
        </div>
    );
};

export default Contact;
