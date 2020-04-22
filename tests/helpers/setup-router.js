export default function (hooks) {
  hooks.beforeEach(function () {
    const router = this.owner.lookup('router:main');
    router.initialURL = '/missing';
    router.startRouting();
  });
}
