import Lottie from "react-lottie";
import groovyWalkAnimation from "./groovyWalk.json";


const Example = () => {
  const options = {
    animationData: groovyWalkAnimation,
    loop: true,
    autoplay: true,
    eventListeners:[
      {
        eventName: 'complete',
        callback: () => console.log('the animation completed:'),
      },
    ]
  }

//  const { View } = useLottie(options);

  return (
      <div className="reveal-from-bottom" data-reveal-delay="200">
       <Lottie
        options={options}
        isClickToPauseDisabled={true}
         height={400}
         width={400}
       />
     </div>
   );
};


export default Example;
