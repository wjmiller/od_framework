export default function(context) {
  if (!context.store.getters.is_authenticated) {
    context.redirect('/auth')
  }
}