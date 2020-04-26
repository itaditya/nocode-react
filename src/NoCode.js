import React, { Fragment, useState } from 'react';

function genCode(item) {
  if (!item) {
    return null;
  }

  const { type, props, children } = item;

  const childrenArray = [];

  if (Array.isArray(children)) {
    children.forEach(child => {
      childrenArray.push(genCode(child));
    });
  } else {
    childrenArray.push(children);
  }

  return React.createElement(type, props, ...childrenArray);
}

const componentInstances = {};

export default function NoCode(props) {
  const { components } = props;
  const [stateCompsList, setStateCompsList] = useState(() =>
    Object.keys(componentInstances)
  );
  const numCompsInstances = stateCompsList.length;

  const codeSource = {
    type: Fragment,
    props: {},
    children: stateCompsList.map(id => componentInstances[id]),
  };

  function createInstance(comp) {
    const id = comp + '-' + Math.random();
    componentInstances[id] = {
      type: components[comp],
      props: {},
      children: [],
    };
    setStateCompsList(oldState => [...oldState, id]);
  }

  function move(inst, oldPos, newPos) {
    const array = [...stateCompsList];
    array.splice(oldPos, 1);
    array.splice(newPos, 0, inst);
    setStateCompsList(array);
  }

  function updateProps(inst, event) {
    event.preventDefault();
    const inputElem = document.querySelector(`[name="props-input-${inst}"]`);
    if (!inputElem) {
      return;
    }
    const oldProps = componentInstances[inst].props;
    const newProps = JSON.parse(inputElem.value);
    componentInstances[inst].props = {
      ...oldProps,
      ...newProps,
    };

    setStateCompsList(oldState => [...oldState]);
  }

  return (
    <div>
      <div className="controls-wrapper">
        <ul className="components-list">
          {Object.keys(components).map(comp => (
            <li key={comp}>
              <span>{comp}</span>
              <button onClick={() => createInstance(comp)}>Use</button>
            </li>
          ))}
        </ul>
        <ul className="instances-list">
          {stateCompsList.map((inst, index) => (
            <li key={inst}>
              <span>{inst}</span>
              <button
                disabled={index === 0}
                onClick={() => move(inst, index, index - 1)}
              >
                Up
              </button>
              <button
                disabled={index === numCompsInstances - 1}
                onClick={() => move(inst, index, index + 1)}
              >
                Down
              </button>
              <form onSubmit={event => updateProps(inst, event)}>
                <label>
                  Props:{' '}
                  <input
                    type="text"
                    name={`props-input-${inst}`}
                    defaultValue={JSON.stringify(
                      componentInstances[inst].props
                    )}
                  />
                  <button type="submit">Update</button>
                </label>
              </form>
            </li>
          ))}
        </ul>
      </div>
      {genCode(codeSource)}
    </div>
  );
}
