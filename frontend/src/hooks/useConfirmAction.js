export function useConfirmAction() {
  const confirmAction = (message) => {
    return window.confirm(message);
  };

  return { confirmAction };
}