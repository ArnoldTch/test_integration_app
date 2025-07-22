import { render, fireEvent } from '@testing-library/vue'
import Login from '../pages/login.vue'

global.$fetch = jest.fn()

describe('Page de login', () => {
  beforeEach(() => {
    $fetch.mockClear()
  })

  test('les champs email et mot de passe sont présents', () => {
    const { getByTestId } = render(Login)

    expect(getByTestId('email')).toBeTruthy()
    expect(getByTestId('password')).toBeTruthy()
    expect(getByTestId('submit')).toBeTruthy()
  })

  test('soumission avec succès appelle $fetch et affiche Bienvenue', async () => {
    $fetch.mockResolvedValue({ token: 'token-123' })

    window.alert = jest.fn()

    const { getByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'test@email.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect($fetch).toHaveBeenCalledWith('http://localhost:3001/login', expect.any(Object))
    expect(window.alert).toHaveBeenCalledWith('Bienvenue')
  })

  test('affiche une erreur si le mot de passe est incorrect (401)', async () => {
    $fetch.mockRejectedValue({ data: { error: 'Mot de passe incorrect' } })

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'test@email.com')
    await fireEvent.update(getByTestId('password'), 'wrongpass')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Mot de passe incorrect')
  })

  test('affiche une erreur si l’utilisateur est inconnu (404)', async () => {
    $fetch.mockRejectedValue({ data: { error: 'Email inconnu' } })

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'notfound@email.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Email inconnu')
  })

  test('affiche une erreur générique si le serveur ne répond pas', async () => {
    $fetch.mockRejectedValue(new Error('Network error'))

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'email@test.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Erreur inconnue ou serveur injoignable')
  })
})