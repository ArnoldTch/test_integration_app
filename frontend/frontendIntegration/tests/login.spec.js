import { render, fireEvent } from '@testing-library/vue'
import Login from '../pages/login.vue'

global.$fetch = jest.fn()

describe('Tests d’intégration de la page de login', () => {
  beforeEach(() => {
    $fetch.mockClear()
  })

  test('Affiche les champs email, mot de passe et le bouton de connexion', () => {
    const { getByTestId } = render(Login)

    expect(getByTestId('email')).toBeTruthy()
    expect(getByTestId('password')).toBeTruthy()
    expect(getByTestId('submit')).toBeTruthy()
  })

  test('Soumission réussie : appelle $fetch et affiche Bienvenue', async () => {
    $fetch.mockResolvedValue({ token: 'fake-token' })
    window.alert = jest.fn()

    const { getByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'user@example.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect($fetch).toHaveBeenCalledWith(
      'http://localhost:3001/login',
      expect.objectContaining({
        method: 'POST',
        body: {
          email: 'user@example.com',
          password: '1234'
        }
      })
    )
    expect(window.alert).toHaveBeenCalledWith('Bienvenue')
  })

  test('Erreur 401 : mauvais mot de passe', async () => {
    $fetch.mockRejectedValue({ data: { error: 'Mot de passe incorrect' } })

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'user@example.com')
    await fireEvent.update(getByTestId('password'), 'wrongpass')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Mot de passe incorrect')
  })

  test('Erreur 404 : utilisateur inconnu', async () => {
    $fetch.mockRejectedValue({ data: { error: 'Email inconnu' } })

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'unknown@example.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Email inconnu')
  })

  test('Erreur générique : serveur injoignable', async () => {
    $fetch.mockRejectedValue(new Error('Network error'))

    const { getByTestId, findByTestId } = render(Login)

    await fireEvent.update(getByTestId('email'), 'user@example.com')
    await fireEvent.update(getByTestId('password'), '1234')
    await fireEvent.click(getByTestId('submit'))

    expect(await findByTestId('error')).toHaveTextContent('Erreur inconnue ou serveur injoignable')
  })
})
