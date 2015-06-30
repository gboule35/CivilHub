# -*- coding: utf-8 -*-
from django import forms
from django.utils.translation import ugettext_lazy as _

from taggit.forms import TagField

from locations.models import Location
from places_core.forms import BootstrapBaseForm

from .models import Idea, Category, Vote


class CategoryForm(forms.ModelForm):
    """
    Create/edit categories for ideas.
    """
    name = forms.CharField(
        max_length = 64,
        widget = forms.TextInput(attrs={
            'class': 'form-control',
            'autofocus': 'autofocus'
        })
    )
    description = forms.CharField(
        max_length = 1024,
        widget = forms.Textarea(attrs={'class': 'form-control'})
    )

    class Meta:
        model = Category
        fields = ('name', 'description',)


class IdeaForm(forms.ModelForm, BootstrapBaseForm):
    """ Edit/update/create idea form. """
    name = forms.CharField(
        required = True,
        max_length = 64,
        label = _("Name"),
        widget = forms.TextInput(attrs={'class': 'form-control'})
    )
    description = forms.CharField(
        required = False,
        label = _("Description"),
        widget = forms.Textarea(attrs={'class': 'form-control'})
    )
    category = forms.ModelChoiceField(
        required = False,
        queryset = Category.objects.all(),
        label = _("Category"),
        widget = forms.Select(attrs={'class': 'form-control'})
    )
    tags = TagField(label=_("Tags"), required=False)

    class Meta:
        model = Idea
        fields = ('name', 'description', 'video_url', 'tags', 'category', 'image', 'status',)
        widgets = {
            'status': forms.Select(attrs={'class': 'form-control'}),
        }


class PositiveCommentForm(forms.ModelForm):
    positive_comment = forms.CharField(label="", required=False,
                    widget=forms.Textarea(attrs={'class': 'form-control', }))

    class Meta:
        model = Vote
        fields = ('positive_comment', )


class NegativeCommentForm(forms.ModelForm):
    negative_comment = forms.CharField(label="",
        widget=forms.Textarea(attrs={'class': 'form-control', }))

    class Meta:
        model = Vote
        fields = ('negative_comment', )
