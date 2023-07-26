import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import USWDS from "@uswds/uswds/src/js";
const { characterCount, accordion } = USWDS;

function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // initialize
    characterCount.on(ref);
    // default ref is document.body, if you want to use
    // default you do not have to pass arguments
    accordion.on();

    // remove event listeners when the component un-mounts.
    return () => {
      characterCount.off();
      accordion.off();
    };
  });
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);