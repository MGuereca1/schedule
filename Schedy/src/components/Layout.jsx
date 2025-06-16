export default function Layout (props){
    const {children} = props


    const header = (
        <header>
            <div>
                <h1 className="text-gradient">Schedy</h1>
                <p>your schedule made easy</p>
            </div>

            <button>
                <p>Sign up</p>
                
            </button>
        </header>
    )
    
    const footer = (
        <footer>
            <p><span className="text-gradient">Schedy </span>
            was made by <a>Me</a></p>
        </footer>
    )

    return(
        <>
            {header}
            <main>
                {children}
            </main>
            {footer}
        
        </>
    )
}