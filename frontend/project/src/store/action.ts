import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserAuth, User, Offer, Comment, CommentAuth, FavoriteAuth, NewOffer, Type } from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';
import UserWithTokenDto from '../dto/user/user-with-token.dto';
import CreateUserWithIdDto from '../dto/user/create-user-with-id.dto';
import CreateUserDto from '../dto/user/create-user.dto';
import { Signup } from '../types/user';
import OfferDto from '../dto/offer/offer.dto';
import { Amenities, CreateOfferDto, RentalType } from '../dto/offer/create-offer.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Offers);

    return adaptOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Favorite);

    return adaptOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NOT_FOUND) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const createOfferDto: CreateOfferDto = adaptCreateOfferToServer(newOffer);
    const responce = await api.post<CreateOfferDto>(ApiRoute.Offers, createOfferDto);

    if (responce.status === HttpCode.CREATED) {
      const postAvatarApiRoute = `${ApiRoute.Offers}/${responce.data.id}${ApiRoute.PreviewImage}`;
      if (responce.data.previewImage) {
        await api.post(postAvatarApiRoute, adaptPreviewImageToServer(responce.data.previewImage), {
          headers: {'Content-Type': 'multipart/form-data'},
        });
      }
    }

    history.push(`${AppRoute.Property}/${responce.data.id}`);
    const adaptedOffer: Offer = adaptCreateOfferToClient(responce.data);
    return adaptedOffer;
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<OfferDto>(`${ApiRoute.Offers}/${offer.id}`, adaptOfferToServer(offer));
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(`${ApiRoute.Premium}?city=${cityName}`);

    return adaptOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Comment[]>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`);

    return data;
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<User>(ApiRoute.Login);

      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<UserWithTokenDto>(ApiRoute.Login, { email, password });
    const { token } = data;

    if(token){
      Token.save(token);
    }

    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.delete(ApiRoute.Logout);

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, Signup, { extra: Extra }>(
  Action.REGISTER_USER,
  async (userData, { extra }) => {
    const { api, history } = extra;

    const postData = await api.post<CreateUserWithIdDto>(ApiRoute.Register, adaptSignupToServer(userData));

    if (postData.status === HttpCode.CREATED) {
      const postAvatarApiRoute = `${ApiRoute.Users}/${postData.data.id}${ApiRoute.Avatar}`;
      if (userData.avatar) {
        await api.post(postAvatarApiRoute, adaptAvatarToServer(userData.avatar), {
          headers: {'Content-Type': 'multipart/form-data'},
        });
      }
    }
    history.push(AppRoute.Login);
  });

export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Comment>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`, { comment, rating });

    return data;
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<OfferDto>(
      `${ApiRoute.Favorite}/${id}`
    );

    return adaptOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<OfferDto>(
      `${ApiRoute.Favorite}/${id}`
    );

    return adaptOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const adaptPreviewImageToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('previewImage', file);

    return formData;
  };

export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptSignupToServer =
  (user: Signup): CreateUserDto => ({
    name: user.name,
    email: user.email,
    avatar: '',
    userType: user.userType,
    password: user.password,
  });

const adaptOffersToClient =
    (offers: OfferDto[]): Offer[] =>
      offers
        .filter((offer: OfferDto) =>
          offer.userId !== null,
        )
        .map((offer: OfferDto) => ({
          id: offer.id,
          title: offer.title,
          description: offer.description,
          city: {
            name: offer.city,
            location: offer.coordinates,
          },
          location: offer.coordinates,
          previewImage: offer.previewImage,
          isPremium: offer.isPremium,
          isFavorite: offer.isFavorite,
          rating: Number(offer.rating),
          type: offer.type,
          bedrooms: offer.rooms,
          maxAdults: offer.guests,
          price: Number(offer.price),
          goods: offer.amenities,
          images: offer.images,
          host: {
            name: offer.userId.name,
            avatarUrl: offer.userId.avatar,
            email: offer.userId.email,
            userType: offer.userId.userType
          }
        }));

const adaptOfferToClient =
  (offer: OfferDto): Offer =>
    ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      city: {
        name: offer.city,
        location: offer.coordinates,
      },
      location: offer.coordinates,
      previewImage: offer.previewImage,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: Number(offer.rating),
      type: offer.type,
      bedrooms: offer.rooms,
      maxAdults: offer.guests,
      price: Number(offer.price),
      goods: offer.amenities,
      images: offer.images,
      host: {
        name: offer.userId.name,
        avatarUrl: offer.userId.avatar,
        email: offer.userId.email,
        userType: offer.userId.userType
      }
    });

const adaptOfferToServer =
    (offer: Offer): OfferDto =>
      ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        city: offer.city.name,
        coordinates: offer.city.location,
        previewImage: offer.previewImage,
        isPremium: offer.isPremium,
        isFavorite: offer.isFavorite,
        rating: Number(offer.rating),
        type: mapTypeToRentalType(offer.type),
        rooms: offer.bedrooms,
        guests: offer.maxAdults,
        price: Number(offer.price),
        amenities: offer.goods as Amenities[],
        images: offer.images,
        userId: {
          name: offer.host.name,
          avatar: offer.host.avatarUrl,
          email: offer.host.email,
          userType: offer.host.userType
        }
      });

const adaptCreateOfferToServer = (newOffer: NewOffer): CreateOfferDto => {
  const createOfferDto = new CreateOfferDto();
  createOfferDto.publicationDate = new Date().toISOString();
  createOfferDto.title = newOffer.title;
  createOfferDto.description = newOffer.description;
  createOfferDto.city = newOffer.city.name;
  createOfferDto.previewImage = newOffer.previewImage;
  createOfferDto.isPremium = newOffer.isPremium;
  createOfferDto.isFavorite = false;
  createOfferDto.type = mapTypeToRentalType(newOffer.type);
  createOfferDto.rooms = newOffer.bedrooms;
  createOfferDto.guests = newOffer.maxAdults;
  createOfferDto.price = newOffer.price;
  createOfferDto.amenities = newOffer.goods as Amenities[];
  createOfferDto.coordinates = newOffer.location;
  createOfferDto.images = newOffer.images;
  createOfferDto.commentCount = 0;
  createOfferDto.rating = 1;
  return createOfferDto;
};

const mapTypeToRentalType = (type: Type): RentalType => {
  switch (type) {
    case 'apartment':
      return RentalType.Apartment;
    case 'house':
      return RentalType.House;
    case 'room':
      return RentalType.Room;
    case 'hotel':
      return RentalType.Hotel;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

const adaptCreateOfferToClient = (createOfferDto: CreateOfferDto): Offer => {
  const offer: Offer = {
    id: createOfferDto.id,
    price: createOfferDto.price,
    rating: createOfferDto.rating,
    title: createOfferDto.title,
    isPremium: createOfferDto.isPremium,
    isFavorite: createOfferDto.isFavorite,
    city: {
      name: createOfferDto.city,
      location: createOfferDto.coordinates
    },
    location: createOfferDto.coordinates,
    previewImage: createOfferDto.previewImage,
    type: createOfferDto.type,
    bedrooms: createOfferDto.rooms,
    description: createOfferDto.description,
    goods: createOfferDto.amenities,
    host: {
      name: createOfferDto.userId.name,
      avatarUrl: createOfferDto.userId.avatar,
      email: createOfferDto.userId.email,
      userType: createOfferDto.userId.userType,
    },
    images: createOfferDto.images,
    maxAdults: createOfferDto.guests,
  };
  return offer;
};
