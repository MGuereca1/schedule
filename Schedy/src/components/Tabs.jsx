export default function Tabs (props){
    // create differen tabs
    const tabs = ['Todo','Week', 'Month', 'Completed']

    const { todos, selectedTab, setSelectedTab } = props

    return(
        <nav className="tabs-container">
            {/* using similar techniques to the todo-app tabs
            will mab out the tab and return a button for each */}

            {tabs.map((tab, tabIndex) => {

                return(
                    <button onClick={() => {
                        setSelectedTab(tab)
                    }} key={tabIndex}
                    className={"tab-button" + (tab == selectedTab ? 'tab-selected': ' ')}>
                        <h4>
                            {tab}

                        </h4>

                    </button>
                )
            })}
        </nav>
    )

}