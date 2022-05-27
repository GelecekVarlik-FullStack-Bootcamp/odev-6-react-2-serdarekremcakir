import React, { useState, useEffect } from 'react';
import './Main.css';
import axios from 'axios';

function Main() {
    const [data, setData] = useState([]);
    const [cat, setCat] = useState([]);
    const [change, setChange] = useState("Todos");
    const [title, setTitle] = useState("");
    const [inputcolor, setInputcolor] = useState("");
    const [categoryid, setCategoryid] = useState(0);
    const [statusid, setStatusid] = useState(0);
    const [colors, setColors] = useState([]);
    const [categorystatus, setCategorystatus] = useState([]);


    const listData = () => {
        let url = "";
        if (change === "Categories") {
            url = `http://localhost:80/category`;
        }
        else {
            url = `http://localhost:80/todo`
        }
        axios.get(url, { withCredentials: true }).then(res => {
            setData(
                res.data

            )
        }).catch((error) => error.message === "Request failed with status code 403" ? alert("error 403") : null)


    }

    const addData = () => {
        let url = "";
        if (change === "Categories") {
            url = `http://localhost:80/category`;
        }
        else {
            url = `http://localhost:80/todo`
        }
        if (title === "") {
            alert("title error")
        }
        else{
            axios.post(url, change === "Categories"
            ? { "title": title } : {
                "title": title, "categoryId": categoryid,
                "statusId": statusid
            }, { withCredentials: true }).then(res => {

                setData([...data, res.data])
                setTitle('');

            }).catch((error) => alert("Error",error.message))
        }
        
    }


    useEffect(() => {
        axios.get(`http://localhost:80/category`, { withCredentials: true }).then(res => {
            setCat(
                res.data
            )
        })


        listData();
        setCategoryid(0);
        setStatusid(0);
    }, [change])



    useEffect(() => {
        if (change === "Todos") {
            getStatuswithCategoryId(categoryid);
        }

    }, [categoryid])

    useEffect(() => {
        if (change === "Todos") {
            getStatuswithId();
        }

    }, [data])

    const getStatuswithId = async () => {
        await Promise.all(data.map(async (i) => getStatusbyId(i.statusId))).then(item => { setColors(item) })
    }

    const getStatusbyId = async (id) => {

        return await axios.get("http://localhost:80/status/" + id, { withCredentials: true }).then(res => res.data.color
        )
    }

    const closeModal = (id,title) => {
        let modal = document.getElementById("modal");
        modal.classList.toggle("close");
        getStatuswithCategoryId(id);
        setCategoryid(id);
        document.getElementById("statustitle").innerHTML = title + " Status";
    }

    const getStatuswithCategoryId = (id) => {
        axios.get("http://localhost:80/status?categoryId=" + id, { withCredentials: true }).then(res => {

            setCategorystatus(res.data)
        })
    }

    const addStatus = () => {
        const statusData = {
            "title":title,
            "categoryId":categoryid,
            "color":inputcolor
        };

        axios.post("http://localhost:80/status", statusData, {withCredentials: true}).then(res => {

            setCategorystatus([...categorystatus, res.data])
            setTitle('');
            setInputcolor('')
        })


    }

    const changeColor = (id) => {
        const statusData = {
            "color": inputcolor
        }

        axios.put("http://localhost:80/status/" + id, statusData, {withCredentials: true}).then(res => {

            setInputcolor('');
            alert("Successful")
            let modal = document.getElementById("modal");
        modal.classList.toggle("close");

        })
    }

    const deleteStatus = (id) => {
        axios.delete("http://localhost:80/status/" + id, {withCredentials: true}).then(res => {
            alert("Successful")
            closeModal();

        })
    }




    return (
        <div style={{ backgroundColor: 'grey' }} className="main">
            <div className='switch'>
                <button onClick={() => { setChange("Todos") }}>Todos</button>
                <button onClick={() => { setChange("Categories") }}>Categories</button>
            </div>

            {change === "Todos" ? <div className='todoadd'>
                <input type="text" placeholder='Tittle' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <select onChange={(e) => {
                    setCategoryid(parseInt(e.target.value));
                    document.getElementById("slct").setAttribute("selected", "selected");
                    setStatusid(0);
                }} name="" id="asd">
                    {cat.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        )
                    })}
                </select>

                <select name="" id="select2" onChange={(e) => setStatusid(parseInt(e.target.value))}>
                    <option id="slct" selected value> -- select an option -- </option>
                    {categorystatus.map((item) => {
                        return (
                            <>



                                <option key={item.id} value={item.id}>{item.title}</option></>
                        )
                    })}
                </select>
                {statusid === 0 ? <button onClick={() => alert("Select Status!")}> Add</button> : <button onClick={addData}> Add</button>}
            </div> :
                <div className='add'>
                    <input type="text" placeholder='Category Tittle' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    <button onClick={addData}>Add</button>
                </div>}


            <div className='box'>

                {change === "Todos" ?
                    <ul>
                        {data?.map((item, index) => {

                            return (
                                <>
                                    <li style={{ backgroundColor: colors[index] }} key={item.id}>
                                        <p >{item.title}</p>
                                        <div>

                                            <button onClick={()=>console.log("update")}>Update</button>
                                        </div>
                                    </li></>
                            )
                        })}
                    </ul> :
                    <ul>
                        {data?.map((item) => {

                            return (
                                <>
                                    <li key={item.id}>
                                        <p >{item.title}</p>
                                        <div>
                                            <button onClick={() => closeModal(item.id,item.title)}>View Statuses</button>
                                            <button onClick={()=> console.log("update")}>Update</button>
                                        </div>
                                    </li></>
                            )
                        })}
                    </ul>

                }


            </div>

            <div id="modal" className='modalContainer close'>
                <div className='modalHeader'>
                    <p id="statustitle">Status</p>
                    <button id="close" onClick={() => {
                        let modal = document.getElementById("modal");
                        modal.classList.toggle("close")
                    }}>X</button>
                </div>
                <div className='modalContent'>
                    <div className='modalAdd'>
                        <input type="text" placeholder='Status Title' value={title} onChange={(e) => { setTitle(e.target.value) }}/>
                        <input type="text" placeholder='Color' value={inputcolor} onChange={(e) => { setInputcolor(e.target.value) }}/>
                        <button onClick={addStatus}>Add</button>
                    </div>
                    <div className='modalBox'>
                        <ul>
                            {categorystatus.map((x)=>{
                                return(
                                    <li key={x.id} style={{ backgroundColor: x.color }}>
                                <p className='statuslisttitle'>{x.title}</p>
                                <input type="text" placeholder='Color' value={inputcolor} onChange={(e) => { setInputcolor(e.target.value) }} />
                                <button onClick={()=> changeColor(x.id)}>Change Color</button>
                                <button onClick={()=> deleteStatus(x.id)}>Delete</button>
                            </li>
                                )
                            })}
                            
                        </ul>
                    </div>

                </div>
            </div>


        </div>

    )
}

export default Main