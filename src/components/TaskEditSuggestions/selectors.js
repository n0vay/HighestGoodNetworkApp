export const getTaskEditSuggestionsData = (state) => {
  return ({
  isLoading: state.taskEditSuggestions.isLoading,
  taskEditSuggestions: state.taskEditSuggestions.taskEditSuggestions,
  userSortDirection: state.taskEditSuggestions.userSortDirection,
  dateSuggestedSortDirection: state.taskEditSuggestions.dateSuggestedSortDirection,
})};