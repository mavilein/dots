import { finalize } from 'rxjs/operators';
import DigitalOcean from '../';
import { IAction } from '../src/common/interfaces';
import { isAction, isCollection } from '../src/common/type.guards';

export default function(digitalOcean: DigitalOcean) {
  const Action = digitalOcean.Action;
  let actionToTest: IAction;
  describe('List Actions', () => {
    it('`list` should exists', () => expect(Action.get).toBeDefined());
    it('`list` should be a function', () => expect(typeof Action.get).toBe('function'));
    it('`list` should return Action\'s collecion', (done) => {
      const perPage = 10;
      const onActions = (collection) => {
        expect(collection).toBeDefined();
        expect(isCollection(collection)).toBeTruthy();
        expect(collection.perPage).toBe(perPage);
        const actions = collection.items;
        expect(Array.isArray(actions)).toBeTruthy();
        expect(collection.items.length).toBeLessThanOrEqual(perPage);
        actions.forEach((action) => expect(isAction(action)).toBeTruthy());
        actionToTest = actions[Math.floor(Math.random() * actions.length) + 1];
      };
      const onError = (err) => {
        expect(err instanceof Error).toBeTruthy();
        expect(typeof err.message).toBe('string');
        fail(err.message);
      };
      Action.list(0, perPage)
        .pipe(
          finalize(done),
        )
        .subscribe(onActions, onError);
    }, digitalOcean.timeout);
  });

  describe('Get Action', () => {
    it('`Get` should exists', () => expect(Action.get).toBeDefined());
    it('`Get` should be a function', () => expect(typeof Action.get).toBe('function'));
    it('`Get` should return Action object', (done) => {
      const onAction = (action) => {
        expect(action).toBeDefined();
        expect(isAction(action)).toBeTruthy();
        expect(action.id).toBe(actionToTest.id);
      };
      const onError = (err) => {
        expect(err instanceof Error).toBeTruthy();
        expect(typeof err.message).toBe('string');
        fail(err.message);
      };
      Action.get(actionToTest.id)
        .pipe(
          finalize(done),
        )
        .subscribe(onAction, onError);
    }, digitalOcean.timeout);
  });
}