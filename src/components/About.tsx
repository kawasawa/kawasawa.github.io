import { init, send } from '@emailjs/browser';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowForwardIosSharp as ArrowForwardIosSharpIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  PlaceOutlined as PlaceOutlinedIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary as MuiAccordionSummary,
  AccordionSummaryProps,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { SxProps } from '@mui/system';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';

import { extractAlt } from '../assets';
import imageProfile from '../assets/profile.webp';
import { constants } from '../constants';
import Yup from '../locales/yup.ja';
import { career, certification, skill, sns } from '../models';
import { handleError } from '../utils/errors';
import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from './controls';
import { ConfirmDialog, PrivacyPolicyDialog } from './dialogs';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  () => ({
    border: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: 13, color: 'text.secondary' }} />}
    {...props}
  />
))(() => ({
  flexDirection: 'row-reverse',
  minHeight: 0,
  '& .MuiAccordionSummary-content': {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

const ProfileSectionTitle = ({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) => (
  <Box sx={{ py: 1, borderBottom: 1, borderColor: 'grey.800', ...sx }}>
    <Typography variant="h5" sx={{ ml: 1 }}>
      {children}
    </Typography>
  </Box>
);

const Author = () => (
  <Box sx={{ pb: 4, ml: 1 }}>
    <Typography
      sx={{ display: 'inline-block', lineHeight: 1.3, fontSize: { xs: 32, sm: 36 }, fontWeight: 'bold', mr: 2 }}
      data-testid="about__Author--name"
    >
      {constants.meta.author}
    </Typography>
    <Typography
      sx={{ display: 'inline-block', lineHeight: 1.3, fontSize: { xs: 20, sm: 22 }, color: 'text.secondary' }}
      data-testid="about__Author--job"
    >
      {constants.meta.authorJob}
    </Typography>
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sns = ({ t, section }: { t: TFunction; section: string }) => (
  <>
    {sns.map((sns, i) => (
      <Tooltip key={`${section}__sns${i}`} title={sns.name} placement="bottom">
        <IconButton
          color="inherit"
          size="large"
          href={sns.url}
          target="_blank"
          sx={{ mx: { xs: 1, sm: 0.5, md: 1 } }}
          data-testid={`about__Sns${i}`}
        >
          <sns.icon fontSize="large" />
        </IconButton>
      </Tooltip>
    ))}
  </>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Skills = ({ t, section }: { t: TFunction; section: string }) => (
  <>
    <ProfileSectionTitle>SKILLS</ProfileSectionTitle>
    <List sx={{ mb: 1 }}>
      {skill.map((skill, i) =>
        !skill.hidden ? (
          <ListItem
            key={`${section}__Skills${i}`}
            sx={{ py: 0, pr: { xs: 0, sm: 2 }, pl: { xs: 1.5, sm: 2 } }}
            data-testid={`about__Skills${i}`}
          >
            <ListItemText
              primary={
                <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary' }}>
                  <skill.icon sx={{ mr: 0.5 }} />
                  <Typography sx={{ fontSize: 18 }}>{skill.name}</Typography>
                </Stack>
              }
              secondary={
                <ChipList sx={{ mt: 1, ml: 1 }}>
                  {skill.tags.map((tag, j) => (
                    <ChipListItem key={`${section}__Skills${i}--tag${j}`} data-testid={`about__Skills${i}--tag${j}`}>
                      <img src={tag} alt={extractAlt(tag)} loading="lazy" />
                    </ChipListItem>
                  ))}
                </ChipList>
              }
            />
          </ListItem>
        ) : (
          <Accordion
            key={`${section}__Skills${i}`}
            sx={{ bgcolor: 'grey.900', pt: 0.5, mb: 1, pr: { xs: 0, sm: 2 }, pl: { xs: 1.5, sm: 2 } }}
            elevation={0}
            disableGutters
            data-testid={`about__Skills${i}`}
          >
            <AccordionSummary sx={{ p: 0 }}>
              <Link color="inherit" underline="always" sx={{ fontSize: 18, color: 'text.secondary' }}>
                {skill.name}
              </Link>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <ChipList sx={{ mt: 1, ml: 1 }}>
                {skill.tags.map((tag, j) => (
                  <ChipListItem key={`${section}__Skills${i}--tag${j}`} data-testid={`about__Skills${i}--tag${j}`}>
                    <img src={tag} alt={extractAlt(tag)} loading="lazy" />
                  </ChipListItem>
                ))}
              </ChipList>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </List>
  </>
);

const Career = ({ t, section }: { t: TFunction; section: string }) => (
  <>
    <ProfileSectionTitle>CAREER</ProfileSectionTitle>
    <Timeline
      sx={{
        mt: 0,
        pr: { xs: 0, sm: 1 },
        pl: { xs: 1.5, sm: 2 },
        [`& .${timelineOppositeContentClasses.root}`]: {
          pl: 0,
          flex: 0,
        },
      }}
    >
      {career.map((career, i) => (
        <TimelineItem key={`${section}__Career${i}`} data-testid={`about__Career${i}`}>
          <TimelineOppositeContent sx={{ mt: 0.5, pr: 0 }}>
            <Stack width={100}>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 14, ml: 0.1, mr: 0.5 }} />
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 14 }}
                  noWrap
                  data-testid={`about__Career${i}--date`}
                >
                  {career.date}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <PlaceOutlinedIcon sx={{ fontSize: 16, mr: 0.3 }} />
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 14 }}
                  noWrap
                  data-testid={`about__Career${i}--place`}
                >
                  {career.place}
                </Typography>
              </Stack>
            </Stack>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ p: 0, bgcolor: 'white' }}>
              <Avatar
                src={career.favicon}
                alt={t(`text.career__${career.id}--name`)}
                sx={{ width: 36, height: 36 }}
                data-testid={`about__Career${i}--favicon`}
              />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0.5, pr: 0, pl: { xs: 1.5, sm: 2 } }}>
            <Typography sx={{ fontSize: { xs: 15, sm: 16 } }} data-testid={`about__Career${i}--name`}>
              <Link href={career.url} target="_blank" color="inherit" underline="hover">
                {t(`text.career__${career.id}--name`)}
              </Link>
            </Typography>
            <Typography
              sx={{ fontSize: { xs: 13, sm: 14 }, color: 'text.secondary' }}
              data-testid={`about__Career${i}--summary`}
            >
              {t(`text.career__${career.id}--summary`)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </>
);

const Certification = ({ t, section }: { t: TFunction; section: string }) => (
  <>
    <ProfileSectionTitle>CERTIFICATION</ProfileSectionTitle>
    <Timeline
      sx={{
        mt: 0,
        pr: { xs: 0, sm: 1 },
        pl: { xs: 1.5, sm: 2 },
        [`& .${timelineOppositeContentClasses.root}`]: {
          pl: 0,
          flex: 0,
        },
        [`& .${timelineItemClasses.root}`]: {
          minHeight: 0,
        },
      }}
    >
      {certification.map((certification, i) => (
        <TimelineItem key={`${section}__Certification${i}`} data-testid={`about__Certification${i}`}>
          <TimelineOppositeContent sx={{ mt: 1.8, pr: 0 }}>
            <Stack width={100}>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 14, ml: 0.1, mr: 0.5 }} />
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 14 }}
                  noWrap
                  data-testid={`about__Certification${i}--date`}
                >
                  {certification.date}
                </Typography>
              </Stack>
            </Stack>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ p: 0, mb: 0, bgcolor: 'white' }}>
              <Avatar
                src={certification.favicon}
                alt={t(`text.certification__${certification.id}--name`)}
                sx={{ width: 36, height: 36 }}
                data-testid={`about__Certification${i}--favicon`}
              />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 1.8, pr: 0, pl: { xs: 1.5, sm: 2 } }}>
            <Typography sx={{ fontSize: { xs: 15, sm: 16 } }} data-testid={`about__Certification${i}--name`}>
              {t(`text.certification__${certification.id}--name`)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Contact = ({ t, section }: { t: TFunction; section: string }) => {
  const [confirmOpened, setConfirmOpened] = useState(false);
  const confirmInquiry = useCallback(() => setConfirmOpened(true), []);
  const confirmInquiryCanceled = useCallback(() => setConfirmOpened(false), []);

  const [privacyPolicyOpened, setPrivacyPolicyOpened] = useState(false);
  const openPrivacyPolicy = useCallback(() => setPrivacyPolicyOpened(true), []);
  const closePrivacyPolicy = useCallback(() => setPrivacyPolicyOpened(false), []);

  const { formState, register, reset, getValues, handleSubmit } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      inquiry: '',
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        inquiry: Yup.string().required(),
      })
    ),
  });

  const submit = handleSubmit(async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      init(process.env.REACT_APP_EMAILJS_USER_ID!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await send(process.env.REACT_APP_EMAILJS_SERVICE_ID!, process.env.REACT_APP_EMAILJS_TEMPLATE_ID!, {
        name: data.name,
        email: data.email,
        message: data.inquiry,
      });

      reset();
      toast.success(t('message.notify__sendInquiry--succeeded'));
    } catch (err) {
      handleError(err);
    } finally {
      setConfirmOpened(false);
    }
  });

  return (
    <>
      <ConfirmDialog
        open={confirmOpened}
        title={t('message.confirm__sendInquiry')}
        message={getValues('inquiry')}
        affirmativeAction={submit}
        negativeAction={confirmInquiryCanceled}
        bottomContent={formState.isSubmitting && <LinearProgress color="inherit" />}
      />

      <PrivacyPolicyDialog open={privacyPolicyOpened} closeAction={closePrivacyPolicy} />

      <ProfileSectionTitle>CONTACT</ProfileSectionTitle>
      <Box sx={{ px: 1, py: 2 }}>
        <FormControl fullWidth margin="dense">
          <TextField
            {...register('name')}
            error={'name' in formState.errors}
            helperText={formState.errors.name?.message}
            label={t('label.inquiry__name')}
            color="info"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            // HACK: data-testid は内部の input に設定する必要がある
            inputProps={{ 'data-testid': 'about__Contact--name' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            {...register('email')}
            error={'email' in formState.errors}
            helperText={formState.errors.email?.message}
            label={t('label.inquiry__email')}
            color="info"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            // HACK: data-testid は内部の input に設定する必要がある
            inputProps={{ 'data-testid': 'about__Contact--email' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            {...register('inquiry')}
            error={'inquiry' in formState.errors}
            helperText={formState.errors.inquiry?.message}
            label={t('label.inquiry__message')}
            color="info"
            variant="outlined"
            multiline
            minRows={3}
            maxRows={10}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MessageIcon />
                </InputAdornment>
              ),
            }}
            // HACK: data-testid は内部の input に設定する必要がある
            inputProps={{ 'data-testid': 'about__Contact--message' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <Button
            color="info"
            variant="outlined"
            startIcon={<SendIcon />}
            sx={{ mt: 1 }}
            disabled={!formState.isValid || formState.isSubmitting}
            onClick={confirmInquiry}
            data-testid="about__Contact--send"
          >
            {t('label.inquiry__send')}
          </Button>
        </FormControl>

        <Typography sx={{ color: 'grey.600', fontSize: 12, mt: 1 }} data-testid="about__Contact--attention">
          {t('message.notify__sendInquiry--attention')}
        </Typography>

        <Typography sx={{ color: 'grey.400', fontSize: 12, mt: 2, textAlign: 'center' }}>
          <Link
            onClick={openPrivacyPolicy}
            color="inherit"
            underline="always"
            sx={{ cursor: 'pointer' }}
            data-testid="about__Contact--privacyPolicy"
          >
            {t('label.privacyPolicy')}
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export const About = ({ sx }: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(constants.style.inViewOptions);
  const [t] = useTranslation();
  const section = constants.sections.about;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...sx }}>
      <Container>
        <SectionTitle data-testid="about__SectionTitle">{section}</SectionTitle>

        <Box ref={ref}>
          <SectionFadeIn in={inView}>
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={4} order={{ xs: 0, sm: 1 }}>
                <Avatar
                  src={imageProfile}
                  alt="profile image"
                  variant="rounded"
                  sx={{ width: 'auto', height: 'auto', mx: { xs: 4, sm: 0 } }}
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Sns t={t} section={section} />
                </Box>

                <Box sx={{ mt: 2, display: { xs: 'block', sm: 'none' } }}>
                  <Author />
                  <Skills t={t} section={section} />
                  <Career t={t} section={section} />
                  <Certification t={t} section={section} />
                </Box>

                <Box sx={{ mt: { xs: 0.5, sm: 3 } }}>
                  <Contact t={t} section={section} />
                </Box>
              </Grid>

              <Grid item xs={12} sm={8} order={{ xs: 1, sm: 0 }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Author />
                <Skills t={t} section={section} />
                <Career t={t} section={section} />
                <Certification t={t} section={section} />
              </Grid>
            </Grid>
          </SectionFadeIn>
        </Box>
      </Container>
    </Box>
  );
};
