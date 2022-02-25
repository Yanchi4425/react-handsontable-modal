import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import * as Hot from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";

import "./App.css";

const SELECTION = ["Apple", "Microsoft", "Amazon", "Google"];
function App() {
    const hotRef = React.useRef<any>(null);
    const [modalShown, setModalShown] = React.useState(false);
    const [modalRow, setModalRow] = React.useState(0);
    const [modalCol, setModalCol] = React.useState(0);
    const [modalValue, setModalValue] = React.useState("");

    const fetchData = () => {
        if(!modalValue) return SELECTION;
        const regExp = new RegExp(modalValue + ".*", "g");
        return SELECTION.filter((x) => regExp.test(x));
    };

    const openModal = (row, col, value) => {
        setModalRow(row);
        setModalCol(col);
        setModalValue(value);
        setModalShown(true);
    };

    const apply = (value) => {
      setModalShown(false);
      // Not working...
      const hotInstance = hotRef.current.hotInstance;
      hotInstance.setDataAtCell(modalRow,Number(modalCol), value,"modal"); 
    }

    const handleAfterChange = (changes, source) => {
        if (source === "loadData") return false;
        if (!hotRef.current) return false;
        const hotInstance = hotRef.current.hotInstance;
        for (const change of changes) {
            const [row, col, oldVal, value] = change;
            console.log(change);
            if (source === "edit") {
                console.log("set Invalid");

                // not working.
                // hotInstance.setCellMeta(row, col, "valid", false);
                // hotInstance.render();

                // not working.
                // hotInstance.setCellMeta(row, col, "className", "invalid-cell");
                // hotInstance.render();

                // It works, but the background color doesn't change.
                hotInstance.getCell(row, col).classList.add("invalid-cell");
            } else if (source === "modal") {
                console.log("remove Invalid");
                // hotInstance.setCellMeta(row, col, "valid", true);
                hotInstance.getCell(row, col).classList.remove("invalid-cell");
                hotInstance.render();
            }
        }
    };

    return (
        <div className="App">
            <Hot.HotTable
                id="hot"
                ref={hotRef}
                data={[["Apple"], [], []]}
                settings={{
                    columns: [
                        {
                            // modal cell renderer
                            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                                td.replaceChildren();
                                // value
                                const span = document.createElement("span");
                                span.innerText = value;

                                // button
                                const btn = document.createElement("button");
                                btn.innerText = "Open";
                                btn.onclick = () => {
                                    openModal(row, col, value);
                                };
                                td.appendChild(btn);
                                td.appendChild(span);
                            },
                        },
                    ],
                }}
                colHeaders={true}
                rowHeaders={true}
                afterChange={handleAfterChange}
            />
            {/* Modal Component */}
            <Modal open={modalShown} onClose={() => setModalShown(false)}>
                <h2>Select</h2>
                <ul>
                    {fetchData().map((x) => {
                        return (
                            <li
                                key={x}
                                onClick={() => {
                                  apply(x);
                                }}
                            >
                                {x}
                            </li>
                        );
                    })}
                </ul>
            </Modal>
        </div>
    );
}

export default App;
