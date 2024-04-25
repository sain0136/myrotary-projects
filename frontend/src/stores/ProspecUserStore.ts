import { defineStore } from 'pinia';

export const useProspectUserStore = defineStore('prospectUser', {
  // Retrieve the initial state from localStorage or default to false
  state: () => ({
    hasProspectUsers: JSON.parse(localStorage.getItem('hasProspectUsers')!) || false
  }),
  actions: {
    setHasProspectUsers(value: boolean) {
      this.hasProspectUsers = value;
      // Save the new state to localStorage whenever it changes
      localStorage.setItem('hasProspectUsers', JSON.stringify(value));
    }
  }
});