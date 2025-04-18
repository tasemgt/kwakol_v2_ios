export class LoadModalAnimation{

    private animationCtrl;

    constructor(animationCtrl){
        this.animationCtrl = animationCtrl;
    }

    enterAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;
    
        const backdropAnimation = this.animationCtrl
          .create()
          .addElement(root.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    
        const wrapperAnimation = this.animationCtrl
          .create()
          .addElement(root.querySelector('.modal-wrapper')!)
          .keyframes([
            { offset: 0, opacity: '0', transform: 'scale(0)' },
            { offset: 1, opacity: '0.99', transform: 'scale(1)' },
          ]);
    
        return this.animationCtrl
          .create()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
      };
    
      leaveAnimation = (baseEl: HTMLElement) => {
        return this.enterAnimation(baseEl).direction('reverse');
      };
}