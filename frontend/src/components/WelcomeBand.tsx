// This is a functional React component that displays a welcome banner for the store.
function WelcomeBand() {
    return (
        <>
            {/* Wrapper fragment to group the elements without adding extra nodes to the DOM */}
            {/* ---------------------------- */}
            {/* NEW COOL BOOSTRAP WELCOME PAGE!!! */}
            {/* ---------------------------- */}
            <div className="jumbotron">
            <h1 className="display-4">Welcome to Our Store!</h1>
            <p className="lead">Discover a wide range of books and exclusive deals.</p>
            <hr className="my-4"/>
            <p>Browse our collection and find your next great read.</p>
            </div>
        </>

    )
}

export default WelcomeBand;