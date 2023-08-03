import { Dispatch, RefObject, SetStateAction, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { QueryContext } from "./QueryContext";

export interface EditorProps {
    textarea: RefObject<HTMLTextAreaElement>;
    className: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    onInput: (value: string) => void;
}

export function Editor(props: EditorProps) {
    const [insertTab, setInsertTab] = useState<[number, number] | false>(false);
    const [removeTab, setRemoveTab] = useState<[number, string] | false>(false);

    /**
     * See comments below documenting `insertTab` and `removeTab`
     */
    useEffect(() => {
        if (insertTab) {
            if (props.textarea.current) {
                props.textarea.current.selectionStart = insertTab[0] + 1;
                props.textarea.current.selectionEnd = insertTab[1] + 1;
            }

            setInsertTab(false);
        } else if (removeTab) {
            if (props.textarea.current) {
                let start = removeTab[0] - removeTab[1].length;

                props.textarea.current.selectionStart = props.textarea.current.selectionEnd = start;
            }

            setRemoveTab(false);
        }
    }, [props.value]);

    /**
     * Inserting a tab: a novella
     *
     * Due to how React's state updates asynchronously we can't update the cursor immediately
     * So instead the best method I've found for being able to insert a tab is to:
     *      1. Store in `insertTab` the current selection start & end
     *      2. Detect the update of `insertTab` with the following useEffect which:
     *      3. Updates the textarea value with a tab prior to the current selection start (`insertTab[0]`)
     *      4. Detect the update of the textarea value with the above useEffect which:
     *      5. Move the selectionStart and selectionEnd to the new position we need
     *      6. Set `insertTab` back to false, which re-triggers the below useEffect which:
     *      7. Triggers the `props.onInput` to update other editors with the new value
     *
     * @todo add support for multi-line tabbing
     */
    useEffect(() => {
        if (!insertTab) {
            return props.onInput(props.value);
        }

        if (!props.textarea.current) return;

        props.setValue((state) => {
            return state.substring(0, insertTab[0]) + "\t" + state.substring(insertTab[0]);
        });
    }, [insertTab]);

    /**
     * Removing a tab: how hard can it be?
     *
     * Due to how React's state updates asynchronously we can't update the cursor immediately
     * So instead the best method I've found for being able to remove a tab is to:
     *      1. Store in `removeTab` the current selection start & last 1 tab/up to 4 spaces
     *      2. Detect the update of `removeTab` in the following useEffect which:
     *      3. Updates he textarea value to remove the lab 1/up to 4 characters
     *      4. Detect the update of the textarea value with the above useEffect which:
     *      5. Move the selectionStart and selectionEnd to the new position we need
     *      6. Set `removeTab` back to false, which re-triggers the below useEffect which:
     *      7. Triggers the `props.onInput` to update the other editors with the new value
     *
     * @todo add support for multi-line de-tabbing
     */
    useEffect(() => {
        if (!removeTab) {
            return props.onInput(props.value);
        }

        if (!props.textarea.current) return;

        props.setValue((state) => {
            if (removeTab[1].length) {
                return state.substring(0, removeTab[0] - removeTab[1].length) + state.substring(removeTab[0]);
            }

            return state;
        });
    }, [removeTab]);

    return (
        <textarea
            ref={props.textarea}
            className={twMerge(
                "w-full h-full min-h-[16ch] outline-none rounded-xl p-4 border-4 resize-none whitespace-pre",
                props.className
            )}
            style={{
                fontFamily: "Consolas"
            }}
            wrap="soft"
            value={props.value}
            onKeyDownCapture={(event) => {
                if (event.key !== "Tab") return;

                event.preventDefault();
                event.stopPropagation();

                let { selectionStart, selectionEnd } = event.currentTarget;

                if (event.shiftKey) {
                    let match = props.value.substring(selectionStart - 4, selectionStart).match(/(\t| {0,4})$/);

                    setRemoveTab([selectionStart, match ? match[0] : ""]);
                } else {
                    setInsertTab([selectionStart, selectionEnd]);
                }

                return false;
            }}
            onInput={(event) => {
                props.setValue(event.currentTarget.value);

                props.onInput(event.currentTarget.value);
            }}
        ></textarea>
    );
}
