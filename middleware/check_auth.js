export default async function( context ) {
  await context.store.dispatch( 'init_auth', context.req )
}