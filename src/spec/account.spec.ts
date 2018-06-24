import { finalize, tap } from 'rxjs/operators';
import { isAccount } from '../lib/common/type.guards';
import { DigitalOcean } from '../lib/digitalOcean';

export function AccountTests(digitalOcean: DigitalOcean) {
  const Account = digitalOcean.Account;
  describe('Get Account', () => {
    const onAccount = (account) => {
      expect(account).toBeDefined();
      expect(isAccount(account)).toBeTruthy();
    };
    const onError = (err) => {
      expect(err instanceof Error).toBeTruthy();
      expect(typeof err.message).toBe('string');
    };
    it('`Get` should exists', () => expect(Account.get).toBeDefined());
    it('`Get` should be a function', () => expect(typeof Account.get).toBe('function'));
    it('`Get` should return account object', (done) => {
      Account.get().pipe(finalize(done)).subscribe(onAccount, onError);
    }, digitalOcean.timeout);
    it('`Get` should return error', (done) => {
      const throwError = () => {
        throw new Error();
      };
      Account.get()
        .pipe(
          finalize(done),
          tap(throwError),
        )
        .subscribe(onAccount, onError);
    }, digitalOcean.timeout);
  });
}
