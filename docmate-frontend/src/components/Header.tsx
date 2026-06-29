function Header() {

    const email = localStorage.getItem("email");

    return (

        <div
            style={{
                height: "70px",
                background: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}
        >

            <h2>DocMate</h2>

            <div>

                <span>
                    Welcome
                </span>

                <br />

                <strong>
                    {email}
                </strong>

            </div>

        </div>

    );

}

export default Header;