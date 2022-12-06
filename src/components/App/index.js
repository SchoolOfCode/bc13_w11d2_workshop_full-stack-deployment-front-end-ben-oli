import React, { useState, useEffect } from "react";
import InputList from "../InputList";
import ShowList from "../ShowList";
import ClearList from "../ClearList";

/* 1. App will contain components which will allow a person to input items into a list, show the items that are in the list, 
and clear all of the items in a list. 
2. In order for the components to interact with one another, some functionality will need to be hoisted into the App component
 */

const url = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:4000";
// const url = "http://localhost:4000";

function App() {
  const [list, setList] = useState([]);

  // Fetching shopping list data from shopping list API.
  useEffect(() => {
    async function getShoppingList() {
      const response = await fetch(`${url}/items`);
      const data = await response.json(response);
      console.log(data);
      setList(data.payload);
    }
    getShoppingList();
  }, []);

  async function addToList(newListItem) {
    //This function changes the state of the list by pushing the text from the input field in to the array.
    const listItemWithoutId = {
      item: newListItem,
      completed: false,
    };

    const response = await fetch(`${url}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listItem: listItemWithoutId }),
    });

    if (!response.ok) {
      // Shouldn't really use alert, as it blocks, but will do for now.
      return alert("Failed to add item, please try again later.");
    }

    const data = await response.json();
    const listItemWithId = data.payload;

    // if the data payload we get back has a value of true
    if (data.success) {
      // we know everything went ok, and we can safely add our new item to our state
      setList((previous) => [...previous, listItemWithId]);
    } else {
      // alert the user of the error that happened
      // with the error message we got back from the server.
      alert(data.error);
    }
  }

  function clearList() {
    //This function clears all the items that have been added to the list.
    const clearedList = [];
    setList(clearedList);
  }

  async function updateCompleted(idOfTickedItem) {
    // loop over our list state
    // find the index of the item that has the same id as out tickedItem
    // return its completed value

    let value = list.filter((listId) => listId.id === idOfTickedItem);
    console.log(value[0]);

    const updatedListItem = {
      item: value[0].item,
      completed: !value[0].completed,
    };

    const response = await fetch(`${url}/items/${idOfTickedItem}`, {
      method: "PATCH",
      body: JSON.stringify({
        listItem: updatedListItem,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  }

  function tickItem(idOfTickedItem) {
    setList((previous) => {
      return previous.map((item) => {
        return item.id !== idOfTickedItem
          ? item
          : { ...item, completed: !item.completed };
      });
    });

    // call update item function
    updateCompleted(idOfTickedItem);
  }

  return (
    <section>
      <InputList addToList={addToList} buttonText={"Add To List"} />
      <ShowList list={list} tickItem={tickItem} />
      <ClearList clearList={clearList} buttonText={"Clear List"} />
    </section>
  );
}

export default App;
