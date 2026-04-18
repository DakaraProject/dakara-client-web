import { useTransitionState } from 'react-transition-state'

/**
 * Default transition hook.
 * @param options Extra options.
 */
export const useDefaultTransitionState = (options) =>
  useTransitionState({
    timeout: {
      enter: 300,
      exit: 150,
    },
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
    ...options,
  })
