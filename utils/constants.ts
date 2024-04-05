export const headerLinks = [
  {
    id: 'home',
    label: 'Home',
    route: '/'
  },
  {
    id: 'create-event',
    label: 'Create Event',
    route: '/events/create'
  },
  {
    id: 'profile',
    label: 'Profile',
    route: '/profile'
  },
]

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}