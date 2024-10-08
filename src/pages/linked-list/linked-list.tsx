// libraries
import React, { JSX, FormEventHandler, Fragment, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";

// components 
import { ArrowIcon, Button, Circle, Input, SolutionLayout } from "../../ui";

// styles
import styles from "./linked-list.module.css";

// hooks
import useForm from "../../hooks/use-form";

// utils
import ElementData from "../../utils/element-data";
import sequentialUpdate from "../../utils/sequential-update";
import { randomStringsArray } from "../../utils/random-array";
import { ElementCaptions, ElementColors, LinkedListActions, MAX_ELEMENT_LENGTH } from "../../utils/constants";

// data structures 
import { LinkedList } from "../../data-structures";



export default function LinkedListPage(): JSX.Element {
  
  const [valueInput, setValueInput] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [isValueValid, setIsValueValid] = useState(false);
  const [isIndexValid, setIsIndexValid] = useState(false);
  const { onChange } = useForm();
  
  const [action, setAction] = useState(LinkedListActions.Insert);
  const [isInProgress, setIsInProgress] = useState(false);
  
  const [step, setStep] = useState<Array<ElementData<string | undefined>>>(randomStringsArray());
  const [steps, setSteps] = useState<Array<typeof step>>([]);
  
  const onUnshift: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Unshift);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getUnshiftSteps(valueInput));
    setValueInput("");
    setIsValueValid(false);
  };
  
  const onPush: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Push);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getPushSteps(valueInput));
  };
  
  const onShift: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Shift);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getShiftSteps());
  };
  
  const onPop: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Pop);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getPopSteps());
  };
  
  const onInsert: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Insert);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getInsertionSteps(valueInput, Number(indexInput)));
    setValueInput("");
    setIndexInput("");
    setIsValueValid(false);
    setIsIndexValid(false);    
  };  
  
  const onRemove: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setAction(LinkedListActions.Remove);
    const linkedList = new LinkedList<string | undefined>(step);
    setSteps(linkedList.getRemovalSteps(Number(indexInput)));
    setIndexInput("");
    setIsIndexValid(false);    
  };  
  
  useEffect(
    () => {
      let isMounted = true;
      if (steps.length > 0) {
        setIsInProgress(true);
        sequentialUpdate<string | undefined>(steps, setStep, setIsInProgress, () => isMounted);
      };
      return () => {
        isMounted = false;
      };
    }, 
    [steps]
  );  
  
  const supportiveContent = useCallback(
    (value: string | undefined, needsCaption: boolean, caption: string) => (
      value !== undefined
      ? <Circle isSmall={true} value={value} color={ElementColors.Changing} />
      : (needsCaption ? caption : undefined)
    ),
    []
  );
  
  const content = useMemo(
    () => (
      <ul className={styles.list}>
        {
          step.map(
            ({value, color, isHead, isTail, valueAbove, valueBelow}, index, array) => (
              <Fragment key={index}>
                <li className={styles.item}>
                  <Circle
                    value={value}
                    color={color}
                    index={index}
                    above={supportiveContent(valueAbove, isHead, ElementCaptions.Head)}
                    below={supportiveContent(valueBelow, isTail, ElementCaptions.Tail)}
                  />
                </li> 
                {index < array.length-1 && <ArrowIcon />}
              </Fragment>
            )
          )
        }
      </ul>
    ),
    [step, supportiveContent]
  );    
  
  return (
    <SolutionLayout title="Linked List">
      <section className={styles.container} data-testid="linked-list-page">
        <div className={styles.forms}>
          <form className={styles.form} onSubmit={onUnshift} data-testid="value-form">
            <Input 
              maxLength={MAX_ELEMENT_LENGTH}
              isLimitText={true}     
              value={valueInput}
              placeholder="Enter a value"
              data-testid="value-input"
              onChange={onChange(setValueInput, setIsValueValid, false)}
            />
            <Button
              type="submit"
              text="Insert to head"
              data-testid="unshift-button"
              disabled={!isValueValid || (isInProgress && action !== LinkedListActions.Unshift)}
              isLoader={isInProgress && action === LinkedListActions.Unshift}            
            />
            <Button
              type="button"
              text="Insert to tail"
              onClick={onPush}
              data-testid="push-button"
              disabled={!isValueValid || (isInProgress && action !== LinkedListActions.Push)}
              isLoader={isInProgress && action === LinkedListActions.Push}            
            />
            <Button
              type="button"
              text="Remove from head"
              onClick={onShift}
              data-testid="shift-button"
              disabled={step.length === 0 || (isInProgress && action !== LinkedListActions.Shift)}
              isLoader={isInProgress && action === LinkedListActions.Shift}              
            />          
            <Button
              type="button"
              text="Remove from tail"
              onClick={onPop}
              data-testid="pop-button"
              disabled={step.length === 0 || (isInProgress && action !== LinkedListActions.Pop)}
              isLoader={isInProgress && action === LinkedListActions.Pop}              
            />        
          </form>
          <form className={`${styles.form} ${styles.threeColumns}`} onSubmit={onInsert} data-testid="index-form">
            <Input 
              type="number"
              min={0}
              max={step.length}
              value={indexInput}
              placeholder="Enter an index"
              data-testid="index-input"
              onChange={onChange(setIndexInput, setIsIndexValid, false)}
            />
            <Button
              type="submit"
              text="Insert by index"
              data-testid="insert-button"
              disabled={!isValueValid || !isIndexValid || (isInProgress && action !== LinkedListActions.Insert)}
              isLoader={isInProgress && action === LinkedListActions.Insert}            
            />
            <Button
              type="button"
              text="Remove by index"
              onClick={onRemove}
              data-testid="remove-button"
              disabled={!isIndexValid || Number(indexInput) >= step.length || (isInProgress && action !== LinkedListActions.Remove)}
              isLoader={isInProgress && action === LinkedListActions.Remove}            
            />             
          </form>  
        </div>
        {content}
      </section>          
    </SolutionLayout>
  );
};
