export function AccessDeniedCard() {
    return <div className="container max-w-lg rounded p-4 mx-auto bg-white my-5">
        <h1 className="text-red-600 text-3xl my-3">Access denied!</h1>
        <p>Your permissions do not allow you to access this resource</p>
    </div>;
}