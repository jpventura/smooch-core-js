import * as httpMock from '../../mocks/http';
import { getAuthenticationHeaders } from '../../../src/utils/auth';
import { AppUsersStripeApi } from '../../../src/api/appUsersStripe';


describe('AppUsersStripe API', () => {
    const serviceUrl = 'http://some-url.com';
    const userId = 'user-id';
    const httpHeaders = getAuthenticationHeaders({
        jwt: 'jwt'
    });
    let httpSpy;
    let api;

    beforeEach(() => {
        httpSpy = httpMock.mock();
        api = new AppUsersStripeApi(serviceUrl, httpHeaders);
    });

    afterEach(() => {
        httpMock.restore();
    });

    describe('#updateCustomer', () => {
        it('should call http', () => {
            return api.updateCustomer(userId, 'token').then(() => {
                const fullUrl = api.getFullURL('appUsers', userId, 'stripe', 'customer');
                httpSpy.should.have.been.calledWith('POST', fullUrl, {
                    token: 'token'
                }, httpHeaders);
            });
        });

        it('should throw if no token provided', () => {
            return api.updateCustomer(userId).catch(() => {
                httpSpy.should.not.have.been.called;
            });
        });

        describe('with app-token', () => {
            it('should throw', () => {
                const badApi = new AppUsersStripeApi(serviceUrl, getAuthenticationHeaders({
                    appToken: 'token'
                }));

                return badApi.updateCustomer(userId, 'token').catch(() => {
                    httpSpy.should.not.have.been.called;
                });
            });
        });
    });

    describe('#createTransaction', () => {
        describe('with token', () => {
            it('should call http', () => {
                return api.createTransaction(userId, 'actionId', 'token').then(() => {
                    const fullUrl = api.getFullURL('appUsers', userId, 'stripe', 'transaction');
                    httpSpy.should.have.been.calledWith('POST', fullUrl, {
                        actionId: 'actionId',
                        token: 'token'
                    }, httpHeaders);
                });
            });

            it('should throw if no actionId provided', () => {
                return api.createTransaction(userId, undefined, 'token').catch(() => {
                    httpSpy.should.not.have.been.called;
                });
            });
        });

        describe('without token', () => {
            it('should call http', () => {
                return api.createTransaction(userId, 'actionId').then(() => {
                    const fullUrl = api.getFullURL('appUsers', userId, 'stripe', 'transaction');
                    httpSpy.should.have.been.calledWith('POST', fullUrl, {
                        actionId: 'actionId'
                    }, httpHeaders);
                });
            });

            it('should throw if no actionId provided', () => {
                return api.createTransaction(userId, undefined).catch(() => {
                    httpSpy.should.not.have.been.called;
                });
            });
        });
    });
});
